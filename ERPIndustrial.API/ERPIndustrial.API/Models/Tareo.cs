namespace ERPIndustrial.API.Models
{
    public class Tareo
    {
        public int Id { get; set; }
        public int ProyectoId { get; set; }
        public int TecnicoId { get; set; }
        public DateTime Fecha { get; set; }
        public int HorasInvertidas { get; set; }
        public bool Activo { get; set; } = true;
    }
}