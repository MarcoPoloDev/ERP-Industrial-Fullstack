namespace ERPIndustrial.API.Models
{
    public class Material
    {
        public int Id { get; set; }
        public int ProyectoId { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public decimal CostoTotal { get; set; }
        public bool Activo { get; set; } = true;
    }
}