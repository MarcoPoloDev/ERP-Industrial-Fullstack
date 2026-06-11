using ERPIndustrial.API.Data;
using ERPIndustrial.API.DTOs.Especialidades;
using Microsoft.AspNetCore.Mvc;

namespace ERPIndustrial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EspecialidadesController : ControllerBase
    {
        private readonly EspecialidadRepository _repository;

        public EspecialidadesController(EspecialidadRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EspecialidadDTO>>> GetEspecialidades()
        {
            var especialidades = await _repository.GetEspecialidadesAsync();
            return Ok(especialidades);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEspecialidad([FromBody] EspecialidadCreacionDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre) || dto.AreaId <= 0)
                return BadRequest(new { message = "Datos inválidos." });

            bool exito = await _repository.CreateEspecialidadAsync(dto);
            if (!exito) return StatusCode(500, new { message = "Error al crear la especialidad." });

            return Ok(new { success = true, message = "Especialidad creada." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEspecialidad(int id, [FromBody] EspecialidadUpdateDTO dto)
        {
            if (id != dto.Id)
                return BadRequest(new { message = "El ID no coincide." });

            bool exito = await _repository.UpdateEspecialidadAsync(id, dto);
            if (!exito) return NotFound(new { message = "Especialidad no encontrada o inactiva." });

            return Ok(new { success = true, message = "Especialidad actualizada." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEspecialidad(int id)
        {
            try
            {
                bool exito = await _repository.DeleteEspecialidadAsync(id);
                if (!exito) return NotFound(new { message = "Especialidad no encontrada." });

                return Ok(new { success = true, message = "Especialidad eliminada." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EspecialidadDTO>> GetEspecialidadById(int id)
        {
            var especialidad = await _repository.GetEspecialidadByIdAsync(id);
            if (especialidad == null) return NotFound(new { message = "Especialidad no encontrada." });
            return Ok(especialidad);
        }
    }
}