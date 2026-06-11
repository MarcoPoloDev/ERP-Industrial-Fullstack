using ERPIndustrial.API.Data;
using ERPIndustrial.API.DTOs.Areas; 
using Microsoft.AspNetCore.Mvc;

namespace ERPIndustrial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AreasController : ControllerBase
    {
        private readonly AreaRepository _repository;

        public AreasController(AreaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AreaDTO>>> GetAreas()
        {
            var areas = await _repository.GetAreasAsync();
            return Ok(areas);
        }

        [HttpPost]
        public async Task<IActionResult> CreateArea([FromBody] AreaCreacionDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest(new { message = "El nombre es requerido." });

            bool exito = await _repository.CreateAreaAsync(dto);
            if (!exito) return StatusCode(500, new { message = "Error al crear área." });

            return Ok(new { success = true, message = "Área creada exitosamente." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArea(int id, [FromBody] AreaUpdateDTO dto)
        {
            if (id != dto.Id)
                return BadRequest(new { message = "El ID de la URL no coincide con el cuerpo." });

            bool exito = await _repository.UpdateAreaAsync(id, dto);
            if (!exito) return NotFound(new { message = "Área no encontrada o inactiva." });

            return Ok(new { success = true, message = "Área actualizada." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArea(int id)
        {
            try
            {
                bool exito = await _repository.DeleteAreaAsync(id);
                if (!exito) return NotFound(new { message = "Área no encontrada." });

                return Ok(new { success = true, message = "Área eliminada." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AreaDTO>> GetAreaById(int id)
        {
            var area = await _repository.GetAreaByIdAsync(id);
            if (area == null) return NotFound(new { message = "Área no encontrada." });
            return Ok(area);
        }
    }
}