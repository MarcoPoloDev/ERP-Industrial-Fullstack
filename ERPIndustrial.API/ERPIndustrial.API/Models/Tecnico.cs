namespace ERPIndustrial.API.Models
{
    public class Tecnico
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public int EspecialidadId { get; set; }
        public bool Activo { get; set; } = true;
    }
}