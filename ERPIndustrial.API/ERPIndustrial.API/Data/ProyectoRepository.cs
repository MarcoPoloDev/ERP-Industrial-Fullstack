using Microsoft.Data.SqlClient;
using System.Data;
using ERPIndustrial.API.DTOs.Proyectos; 

namespace ERPIndustrial.API.Data
{
    public class ProyectoRepository
    {
        private readonly string _connectionString;

        public ProyectoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException("La cadena de conexión no puede ser nula.");
        }

        public async Task<List<ProyectoDTO>> ObtenerTodosAsync()
        {
            var proyectos = new List<ProyectoDTO>();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_ListarProyectosDirectorio", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            proyectos.Add(new ProyectoDTO
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                CodigoCotizacion = reader["CodigoCotizacion"].ToString() ?? string.Empty,
                                Servicio = reader["Servicio"].ToString() ?? string.Empty,
                                Cliente = reader["Cliente"].ToString() ?? string.Empty,
                                MontoAprobado = Convert.ToDecimal(reader["MontoAprobado"])
                            });
                        }
                    }
                }
            }
            return proyectos;
        }

        public async Task<int> CrearProyectoAsync(ProyectoCreacionDTO nuevoProyecto)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_RegistrarNuevoProyecto", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@CodigoCotizacion", nuevoProyecto.CodigoCotizacion);
                    cmd.Parameters.AddWithValue("@ClienteId", nuevoProyecto.ClienteId);
                    cmd.Parameters.AddWithValue("@Servicio", nuevoProyecto.Servicio);
                    cmd.Parameters.AddWithValue("@Alcance", nuevoProyecto.Alcance);
                    cmd.Parameters.AddWithValue("@MontoAprobado", nuevoProyecto.MontoAprobado);

                    SqlParameter outputIdParam = new SqlParameter("@NuevoProyectoId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(outputIdParam);

                    await con.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();

                    return (int)outputIdParam.Value;
                }
            }
        }

        public async Task<ProyectoDTO?> ObtenerProyectoCompletoAsync(int proyectoId)
        {
            ProyectoDTO? proyecto = null;

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_ObtenerDetalleProyectoCompleto", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ProyectoId", proyectoId);

                    await con.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            proyecto = new ProyectoDTO
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                CodigoCotizacion = reader["CodigoCotizacion"].ToString() ?? string.Empty,
                                Servicio = reader["Servicio"].ToString() ?? string.Empty,
                                Alcance = reader["Alcance"].ToString() ?? string.Empty,
                                Cliente = reader["Cliente"].ToString() ?? string.Empty,
                                MontoAprobado = Convert.ToDecimal(reader["MontoAprobado"])
                            };
                        }

                        if (proyecto == null) return null;

                        if (await reader.NextResultAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                proyecto.Materiales.Add(new MaterialDTO
                                {
                                    Id = Convert.ToInt32(reader["Id"]),
                                    Descripcion = reader["Descripcion"].ToString() ?? string.Empty,
                                    CostoTotal = Convert.ToDecimal(reader["CostoTotal"])
                                });
                            }
                        }

                        if (await reader.NextResultAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                proyecto.Tareos.Add(new TareoDTO
                                {
                                    Id = Convert.ToInt32(reader["Id"]),
                                    Trabajador = reader["Trabajador"].ToString() ?? string.Empty,
                                    Fecha = Convert.ToDateTime(reader["Fecha"]).ToString("yyyy-MM-dd"),
                                    Horas = Convert.ToInt32(reader["Horas"])
                                });
                            }
                        }
                    }
                }
            }

            return proyecto;
        }

        public async Task<bool> AgregarMaterialAsync(int proyectoId, MaterialCreacionDTO material)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_AgregarMaterial", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ProyectoId", proyectoId);
                    cmd.Parameters.AddWithValue("@Descripcion", material.Descripcion);
                    cmd.Parameters.AddWithValue("@CostoTotal", material.CostoTotal);

                    await con.OpenAsync();
                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
        }

        public async Task<bool> AgregarTareoAsync(int proyectoId, TareoCreacionDTO tareo)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_AgregarTareo", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ProyectoId", proyectoId);
                    cmd.Parameters.AddWithValue("@TecnicoId", tareo.TecnicoId);
                    cmd.Parameters.AddWithValue("@Fecha", tareo.Fecha);
                    cmd.Parameters.AddWithValue("@Horas", tareo.HorasInvertidas);

                    await con.OpenAsync();
                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
        }

        public async Task<bool> ActualizarProyectoAsync(int id, ProyectoUpdateDTO proyecto)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Proyectos 
                                 SET CodigoCotizacion = @CodigoCotizacion, ClienteId = @ClienteId, 
                                     Servicio = @Servicio, Alcance = @Alcance, MontoAprobado = @MontoAprobado 
                                 WHERE Id = @Id AND Activo = 1";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@CodigoCotizacion", proyecto.CodigoCotizacion);
                    cmd.Parameters.AddWithValue("@ClienteId", proyecto.ClienteId);
                    cmd.Parameters.AddWithValue("@Servicio", proyecto.Servicio);
                    cmd.Parameters.AddWithValue("@Alcance", proyecto.Alcance);
                    cmd.Parameters.AddWithValue("@MontoAprobado", proyecto.MontoAprobado);

                    await con.OpenAsync();
                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
        }

        public async Task<bool> EliminarProyectoAsync(int id)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_EliminarProyecto", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Id", id);

                    await con.OpenAsync();
                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
        }

        public async Task<bool> ActualizarAlcanceAsync(int id, string nuevoAlcance)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Proyectos SET Alcance = @Alcance WHERE Id = @Id AND Activo = 1";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@Alcance", nuevoAlcance ?? string.Empty);

                    await con.OpenAsync();
                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();

                    return filasAfectadas > 0;
                }
            }
        }
    }
}