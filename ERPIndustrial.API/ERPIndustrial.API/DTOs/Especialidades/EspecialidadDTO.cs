namespace ERPIndustrial.API.DTOs.Especialidades
{
    public class EspecialidadDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int AreaId { get; set; }
        public string AreaNombre { get; set; } = string.Empty; 
    }
}