using ERPIndustrial.API.Data;
using ERPIndustrial.API.DTOs.Tecnicos;
using Microsoft.AspNetCore.Mvc;

namespace ERPIndustrial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TecnicosController : ControllerBase
    {
        private readonly TecnicoRepository _repository;

        public TecnicosController(TecnicoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TecnicoDTO>>> GetTecnicos()
        {
            var tecnicos = await _repository.GetTecnicosAsync();
            return Ok(tecnicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TecnicoDTO>> GetTecnicoById(int id)
        {
            var tecnico = await _repository.GetTecnicoByIdAsync(id); 

            if (tecnico == null) return NotFound(new { message = "Técnico no encontrado." });

            return Ok(tecnico);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTecnico([FromBody] TecnicoCreacionDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NombreCompleto) || dto.EspecialidadId <= 0)
                return BadRequest(new { message = "Datos inválidos." });

            bool exito = await _repository.CreateTecnicoAsync(dto);
            if (!exito) return StatusCode(500, new { message = "Error al crear el técnico." });

            return Ok(new { success = true, message = "Técnico creado." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTecnico(int id, [FromBody] TecnicoUpdateDTO dto)
        {
            if (id != dto.Id)
                return BadRequest(new { message = "El ID no coincide." });

            bool exito = await _repository.UpdateTecnicoAsync(id, dto);
            if (!exito) return NotFound(new { message = "Técnico no encontrado o inactivo." });

            return Ok(new { success = true, message = "Técnico actualizado." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTecnico(int id)
        {
            bool exito = await _repository.DeleteTecnicoAsync(id);
            if (!exito) return NotFound(new { message = "Técnico no encontrado." });

            return Ok(new { success = true, message = "Técnico eliminado lógicamente." });
        }
    }
}