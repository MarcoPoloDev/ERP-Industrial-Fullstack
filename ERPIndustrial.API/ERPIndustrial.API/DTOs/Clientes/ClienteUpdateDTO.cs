namespace ERPIndustrial.API.DTOs.Clientes
{
    public class ClienteUpdateDTO
    {
        public int Id { get; set; }
        public string RazonSocial { get; set; } = string.Empty;
        public string RUC { get; set; } = string.Empty;
        public string Contacto { get; set; } = string.Empty;
    }
}