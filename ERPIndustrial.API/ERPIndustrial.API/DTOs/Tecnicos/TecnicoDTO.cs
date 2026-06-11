namespace ERPIndustrial.API.DTOs.Tecnicos
{
    public class TecnicoDTO
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public int EspecialidadId { get; set; }
        public string EspecialidadNombre { get; set; } = string.Empty;
        public int AreaId { get; set; }
        public string AreaNombre { get; set; } = string.Empty;
    }
}