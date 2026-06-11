using System.Data;
using Microsoft.Data.SqlClient;
using ERPIndustrial.API.DTOs.Tecnicos;

namespace ERPIndustrial.API.Data
{
    public class TecnicoRepository
    {
        private readonly string _connectionString;

        public TecnicoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<IEnumerable<TecnicoDTO>> GetTecnicosAsync()
        {
            var tecnicos = new List<TecnicoDTO>();
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_ListarTecnicos", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            tecnicos.Add(new TecnicoDTO
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                NombreCompleto = reader["NombreCompleto"].ToString() ?? "",
                                AreaId = Convert.ToInt32(reader["AreaId"]),
                                AreaNombre = reader["AreaNombre"].ToString() ?? "",
                                EspecialidadId = Convert.ToInt32(reader["EspecialidadId"]),
                                EspecialidadNombre = reader["EspecialidadNombre"].ToString() ?? ""
                            });
                        }
                    }
                }
            }
            return tecnicos;
        }

        public async Task<bool> CreateTecnicoAsync(TecnicoCreacionDTO dto)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_CrearTecnico", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@NombreCompleto", dto.NombreCompleto);
                    cmd.Parameters.AddWithValue("@EspecialidadId", dto.EspecialidadId);
                    await con.OpenAsync();
                    int filas = await cmd.ExecuteNonQueryAsync();
                    return filas > 0;
                }
            }
        }

        public async Task<bool> UpdateTecnicoAsync(int id, TecnicoUpdateDTO dto)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_ActualizarTecnico", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@NombreCompleto", dto.NombreCompleto);
                    cmd.Parameters.AddWithValue("@EspecialidadId", dto.EspecialidadId);
                    await con.OpenAsync();
                    int filas = await cmd.ExecuteNonQueryAsync();
                    return filas > 0;
                }
            }
        }

        public async Task<bool> DeleteTecnicoAsync(int id)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_EliminarTecnico", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Id", id);
                    await con.OpenAsync();
                    int filas = await cmd.ExecuteNonQueryAsync();
                    return filas > 0;
                }
            }
        }

        public async Task<TecnicoDTO?> GetTecnicoByIdAsync(int id)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"SELECT t.Id, t.NombreCompleto, e.AreaId, a.Nombre AS AreaNombre, 
                                t.EspecialidadId, e.Nombre AS EspecialidadNombre 
                         FROM Tecnicos t
                         INNER JOIN Especialidades e ON t.EspecialidadId = e.Id
                         INNER JOIN Areas a ON e.AreaId = a.Id
                         WHERE t.Id = @Id AND t.Activo = 1";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    await con.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new TecnicoDTO
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                NombreCompleto = reader["NombreCompleto"].ToString() ?? "",
                                AreaId = Convert.ToInt32(reader["AreaId"]),
                                AreaNombre = reader["AreaNombre"].ToString() ?? "",
                                EspecialidadId = Convert.ToInt32(reader["EspecialidadId"]),
                                EspecialidadNombre = reader["EspecialidadNombre"].ToString() ?? ""
                            };
                        }
                    }
                }
            }
            return null; 
        }
    }
}