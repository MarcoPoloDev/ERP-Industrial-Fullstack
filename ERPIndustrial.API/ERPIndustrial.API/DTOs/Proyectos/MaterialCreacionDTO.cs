namespace ERPIndustrial.API.DTOs.Proyectos
{
    // DTO exclusivo para agregar un material a un proyecto existente
    public class MaterialCreacionDTO
    {
        public string Descripcion { get; set; } = string.Empty;
        public decimal CostoTotal { get; set; }
    }
}