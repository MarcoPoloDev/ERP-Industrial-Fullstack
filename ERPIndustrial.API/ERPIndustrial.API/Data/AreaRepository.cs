using Microsoft.Data.SqlClient;
using ERPIndustrial.API.DTOs.Areas;

namespace ERPIndustrial.API.Data
{
    public class AreaRepository
    {
        private readonly string _connectionString;

        public AreaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<IEnumerable<AreaDTO>> GetAreasAsync()
        {
            var areas = new List<AreaDTO>();
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "SELECT Id, Nombre FROM Areas WHERE Activo = 1 ORDER BY Nombre ASC";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            areas.Add(new AreaDTO
                            {
                                Id = reader.GetInt32(0),
                                Nombre = reader.GetString(1)
                            });
                        }
                    }
                }
            }
            return areas;
        }

        public async Task<bool> CreateAreaAsync(AreaCreacionDTO area)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Areas (Nombre, Activo) VALUES (@Nombre, 1)";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Nombre", area.Nombre);
                    await con.OpenAsync();
                    int filas = await cmd.ExecuteNonQueryAsync();
                    return filas > 0;
                }
            }
        }

        public async Task<bool> UpdateAreaAsync(int id, AreaUpdateDTO area)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Areas SET Nombre = @Nombre WHERE Id = @Id AND Activo = 1";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@Nombre", area.Nombre);
                    await con.OpenAsync();
                    int filas = await cmd.ExecuteNonQueryAsync();
                    return filas > 0;
                }
            }
        }

        public async Task<bool> DeleteAreaAsync(int id)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                await con.OpenAsync();

                string checkQuery = "SELECT COUNT(1) FROM Especialidades WHERE AreaId = @Id AND Activo = 1";
                using (SqlCommand cmdCheck = new SqlCommand(checkQuery, con))
                {
                    cmdCheck.Parameters.AddWithValue("@Id", id);
                    int count = (int)await cmdCheck.ExecuteScalarAsync();

                    if (count > 0)
                        throw new InvalidOperationException("No se puede eliminar: Existen especialidades activas asignadas a esta área.");
                }
                string query = "UPDATE Areas SET Activo = 0 WHERE Id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    int filas = await cmd.ExecuteNonQueryAsync();
                    return filas > 0;
                }
            }
        }

        public async Task<AreaDTO?> GetAreaByIdAsync(int id)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "SELECT Id, Nombre FROM Areas WHERE Id = @Id AND Activo = 1";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new AreaDTO { Id = reader.GetInt32(0), Nombre = reader.GetString(1) };
                        }
                    }
                }
            }
            return null;
        }
    }
}