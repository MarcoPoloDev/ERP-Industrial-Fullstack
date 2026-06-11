namespace ERPIndustrial.API.DTOs.Tecnicos
{
    public class TecnicoUpdateDTO
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public int EspecialidadId { get; set; }
    }
}