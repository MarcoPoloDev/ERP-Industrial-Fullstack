namespace ERPIndustrial.API.DTOs.Proyectos
{
    public class ProyectoUpdateDTO
    {
        public int Id { get; set; }
        public string CodigoCotizacion { get; set; } = string.Empty;
        public int ClienteId { get; set; }
        public string Servicio { get; set; } = string.Empty;
        public string Alcance { get; set; } = string.Empty;
        public decimal MontoAprobado { get; set; }
    }
}