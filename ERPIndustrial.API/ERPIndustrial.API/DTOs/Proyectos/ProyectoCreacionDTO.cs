namespace ERPIndustrial.API.DTOs.Proyectos
{
    // DTO exclusivo para recibir datos del formulario de Next.js
    public class ProyectoCreacionDTO
    {
        public string CodigoCotizacion { get; set; } = string.Empty;
        public int ClienteId { get; set; }
        public string Servicio { get; set; } = string.Empty;
        public string Alcance { get; set; } = string.Empty;
        public decimal MontoAprobado { get; set; }
    }
}