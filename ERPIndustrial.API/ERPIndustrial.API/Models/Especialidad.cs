namespace ERPIndustrial.API.Models
{
    public class Especialidad
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int AreaId { get; set; }
        public bool Activo { get; set; } = true;
    }
}