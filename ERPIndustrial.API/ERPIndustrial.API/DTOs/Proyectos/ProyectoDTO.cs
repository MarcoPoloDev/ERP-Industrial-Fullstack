namespace ERPIndustrial.API.DTOs.Proyectos
{
    public class ProyectoDTO
    {
        public int Id { get; set; }
        public string CodigoCotizacion { get; set; }
        public decimal MontoAprobado { get; set; }
        public string Cliente { get; set; }
        public string Servicio { get; set; }
        public string Alcance { get; set; }

        public List<MaterialDTO> Materiales { get; set; } = new List<MaterialDTO>();
        public List<TareoDTO> Tareos { get; set; } = new List<TareoDTO>();
    }
}