namespace ERPIndustrial.API.Models
{
    public class Proyecto
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public string CodigoCotizacion { get; set; } = string.Empty;
        public string Servicio { get; set; } = string.Empty;
        public string Alcance { get; set; } = string.Empty;
        public decimal MontoAprobado { get; set; }
        public bool Activo { get; set; } = true;
    }
}