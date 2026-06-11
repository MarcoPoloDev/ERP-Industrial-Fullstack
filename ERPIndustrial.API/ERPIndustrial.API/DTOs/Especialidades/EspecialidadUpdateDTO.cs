namespace ERPIndustrial.API.DTOs.Especialidades
{
    public class EspecialidadUpdateDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int AreaId { get; set; }
    }
}