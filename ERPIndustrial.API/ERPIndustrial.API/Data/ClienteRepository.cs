using Microsoft.Data.SqlClient;
using System.Data;
using ERPIndustrial.API.DTOs.Clientes;

namespace ERPIndustrial.API.Data
{
    public class ClienteRepository
    {
        private readonly string _connectionString;

        public ClienteRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException("La cadena de conexión no puede ser nula.");
        }
        //OBTENER TODOS LOS CLIENTES
        public async Task<List<ClienteDTO>> ObtenerTodosAsync()
        {
            var clientes = new List<ClienteDTO>();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_ListarClientes", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            clientes.Add(new ClienteDTO
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                RazonSocial = reader["RazonSocial"].ToString() ?? string.Empty,
                                RUC = reader["RUC"].ToString() ?? string.Empty,
                                Contacto = reader["Contacto"].ToString() ?? string.Empty
                            });
                        }
                    }
                }
            }
            return clientes;
        }

        //CREACION DE CLIENTES
        public async Task<bool> AgregarClienteAsync(ClienteCreacionDTO cliente)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_AgregarCliente", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@RazonSocial", cliente.RazonSocial);
                    cmd.Parameters.AddWithValue("@RUC", cliente.RUC);
                    cmd.Parameters.AddWithValue("@Contacto", cliente.Contacto ?? (object)DBNull.Value);

                    await con.OpenAsync();
                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
        }

        //BORRADO LOGICO DE CLIENTES
        public async Task<bool> EliminarClienteAsync(int id)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                // Llamamos a tu nuevo SP
                using (SqlCommand cmd = new SqlCommand("usp_EliminarCliente", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Id", id);

                    await con.OpenAsync();
                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();

                    return filasAfectadas > 0;
                }
            }
        }

        //ACTUALIZAR CLIENTES
        public async Task<bool> ActualizarClienteAsync(int id, ClienteUpdateDTO cliente)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("usp_ActualizarCliente", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@RazonSocial", cliente.RazonSocial);
                    cmd.Parameters.AddWithValue("@RUC", cliente.RUC);
                    cmd.Parameters.AddWithValue("@Contacto", cliente.Contacto ?? (object)DBNull.Value);

                    await con.OpenAsync();
                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
        }

        public async Task<ClienteDTO?> ObtenerPorIdAsync(int id)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "SELECT Id, RazonSocial, RUC, Contacto FROM Clientes WHERE Id = @Id AND Activo = 1";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new ClienteDTO
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                RazonSocial = reader["RazonSocial"].ToString() ?? string.Empty,
                                RUC = reader["RUC"].ToString() ?? string.Empty,
                                Contacto = reader["Contacto"].ToString() ?? string.Empty
                            };
                        }
                    }
                }
            }
            return null;
        }
    }
}