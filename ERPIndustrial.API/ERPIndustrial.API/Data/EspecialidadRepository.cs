using Microsoft.Data.SqlClient;
using ERPIndustrial.API.DTOs.Especialidades; 

namespace ERPIndustrial.API.Data
{
    public class EspecialidadRepository
    {
        private readonly string _connectionString;

        public EspecialidadRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<IEnumerable<EspecialidadDTO>> GetEspecialidadesAsync()
        {
            var especialidades = new List<EspecialidadDTO>();
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"SELECT E.Id, E.Nombre, E.AreaId, A.Nombre AS AreaNombre 
                                 FROM Especialidades E 
                                 INNER JOIN Areas A ON E.AreaId = A.Id 
                                 WHERE E.Activo = 1 
                                 ORDER BY E.Nombre ASC";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            especialidades.Add(new EspecialidadDTO
                            {
                                Id = reader.GetInt32(0),
                                Nombre = reader.GetString(1),
                                AreaId = reader.GetInt32(2),
                                AreaNombre = reader.GetString(3)
                            });
                        }
                    }
                }
            }
            return especialidades;
        }

        public async Task<bool> CreateEspecialidadAsync(EspecialidadCreacionDTO dto)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Especialidades (Nombre, AreaId, Activo) VALUES (@Nombre, @AreaId, 1)";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Nombre", dto.Nombre);
                    cmd.Parameters.AddWithValue("@AreaId", dto.AreaId);
                    await con.OpenAsync();
                    int filas = await cmd.ExecuteNonQueryAsync();
                    return filas > 0;
                }
            }
        }

        public async Task<bool> UpdateEspecialidadAsync(int id, EspecialidadUpdateDTO dto)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Especialidades SET Nombre = @Nombre, AreaId = @AreaId WHERE Id = @Id AND Activo = 1";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@Nombre", dto.Nombre);
                    cmd.Parameters.AddWithValue("@AreaId", dto.AreaId);
                    await con.OpenAsync();
                    int filas = await cmd.ExecuteNonQueryAsync();
                    return filas > 0;
                }
            }
        }

        public async Task<bool> DeleteEspecialidadAsync(int id)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                await con.OpenAsync();

                string checkQuery = "SELECT COUNT(1) FROM Tecnicos WHERE EspecialidadId = @Id AND Activo = 1";
                using (SqlCommand cmdCheck = new SqlCommand(checkQuery, con))
                {
                    cmdCheck.Parameters.AddWithValue("@Id", id);
                    int count = (int)await cmdCheck.ExecuteScalarAsync();

                    if (count > 0)
                        throw new InvalidOperationException("No se puede eliminar: Existen técnicos activos con esta especialidad.");
                }

                string query = "UPDATE Especialidades SET Activo = 0 WHERE Id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    int filas = await cmd.ExecuteNonQueryAsync();
                    return filas > 0;
                }
            }
        }

        public async Task<EspecialidadDTO?> GetEspecialidadByIdAsync(int id)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"SELECT E.Id, E.Nombre, E.AreaId, A.Nombre AS AreaNombre 
                         FROM Especialidades E 
                         INNER JOIN Areas A ON E.AreaId = A.Id 
                         WHERE E.Id = @Id AND E.Activo = 1";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new EspecialidadDTO
                            {
                                Id = reader.GetInt32(0),
                                Nombre = reader.GetString(1),
                                AreaId = reader.GetInt32(2),
                                AreaNombre = reader.GetString(3)
                            };
                        }
                    }
                }
            }
            return null;
        }
    }
}