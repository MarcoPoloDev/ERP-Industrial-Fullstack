using ERPIndustrial.API.Data;
using ERPIndustrial.API.DTOs.Clientes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPIndustrial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly ClienteRepository _repository;

        public ClientesController(ClienteRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<ClienteDTO>>> ObtenerDirectorio()
        {
            var clientes = await _repository.ObtenerTodosAsync();
            return Ok(clientes);
        }

        [HttpPost]
        public async Task<ActionResult> AgregarCliente([FromBody] ClienteCreacionDTO dto)
        {
            try
            {
                bool exito = await _repository.AgregarClienteAsync(dto);
                if (!exito) return BadRequest(new { mensaje = "No se pudo registrar el cliente." });

                return Ok(new { mensaje = "Cliente registrado exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno", detalle = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarCliente(int id)
        {
            try
            {
                bool exito = await _repository.EliminarClienteAsync(id);

                if (!exito)
                {
                    return NotFound(new { mensaje = "Cliente no encontrado o ya fue eliminado." });
                }

                return Ok(new { mensaje = "Cliente eliminado lógicamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno", detalle = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> ActualizarCliente(int id, [FromBody] ClienteUpdateDTO dto) 
        {
            if (id != dto.Id)
            {
                return BadRequest(new { mensaje = "El ID de la URL no coincide con el cuerpo del mensaje." });
            }

            try
            {
                bool exito = await _repository.ActualizarClienteAsync(id, dto);

                if (!exito) return NotFound(new { mensaje = "Cliente no encontrado." });

                return Ok(new { mensaje = "Cliente actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno", detalle = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteDTO>> ObtenerClientePorId(int id)
        {
            try
            {
                var cliente = await _repository.ObtenerPorIdAsync(id);
                if (cliente == null) return NotFound(new { mensaje = "Cliente no encontrado." });
                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno", detalle = ex.Message });
            }
        }
    }
}
