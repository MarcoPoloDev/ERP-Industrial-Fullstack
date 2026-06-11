using Microsoft.AspNetCore.Mvc;
using ERPIndustrial.API.Data;
using ERPIndustrial.API.DTOs.Proyectos;

namespace ERPIndustrial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProyectosController : ControllerBase
    {
        private readonly ProyectoRepository _repository;

        public ProyectosController(ProyectoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProyectoDTO>>> ObtenerDirectorio()
        {
            var proyectos = await _repository.ObtenerTodosAsync();
            return Ok(proyectos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProyectoDTO>> ObtenerProyecto(int id)
        {
            var proyecto = await _repository.ObtenerProyectoCompletoAsync(id);

            if (proyecto == null)
            {
                return NotFound(new { mensaje = $"No se encontró ningún proyecto con el ID {id}" });
            }

            return Ok(proyecto);
        }

        [HttpPost]
        public async Task<ActionResult> CrearProyecto([FromBody] ProyectoCreacionDTO dto)
        {
            try
            {
                int nuevoId = await _repository.CrearProyectoAsync(dto);

                return CreatedAtAction(nameof(ObtenerProyecto), new { id = nuevoId }, new
                {
                    mensaje = "Proyecto registrado exitosamente",
                    id = nuevoId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        [HttpPost("{id}/materiales")]
        public async Task<ActionResult> AgregarMaterial(int id, [FromBody] MaterialCreacionDTO dto)
        {
            try
            {
                var proyectoExiste = await _repository.ObtenerProyectoCompletoAsync(id);
                if (proyectoExiste == null)
                {
                    return NotFound(new { mensaje = $"No se puede agregar material. El proyecto {id} no existe." });
                }

                bool exito = await _repository.AgregarMaterialAsync(id, dto);

                if (!exito)
                {
                    return BadRequest(new { mensaje = "No se pudo registrar el material en la base de datos." });
                }

                return Ok(new { mensaje = "Material agregado exitosamente al proyecto." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno", detalle = ex.Message });
            }
        }

        [HttpPost("{id}/tareos")]
        public async Task<ActionResult> AgregarTareo(int id, [FromBody] TareoCreacionDTO dto)
        {
            try
            {
                var proyectoExiste = await _repository.ObtenerProyectoCompletoAsync(id);
                if (proyectoExiste == null)
                {
                    return NotFound(new { mensaje = $"No se puede registrar tareo. El proyecto {id} no existe." });
                }

                bool exito = await _repository.AgregarTareoAsync(id, dto);

                if (!exito)
                {
                    return BadRequest(new { mensaje = "No se pudo registrar el tareo en la base de datos." });
                }

                return Ok(new { mensaje = "Horas registradas exitosamente al proyecto." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno", detalle = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> ActualizarProyecto(int id, [FromBody] ProyectoUpdateDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest(new { mensaje = "El ID de la URL no coincide con el cuerpo del mensaje." });
            }

            try
            {
                bool exito = await _repository.ActualizarProyectoAsync(id, dto);
                if (!exito) return NotFound(new { mensaje = "Proyecto no encontrado o inactivo." });

                return Ok(new { mensaje = "Proyecto actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarProyecto(int id)
        {
            try
            {
                bool exito = await _repository.EliminarProyectoAsync(id);
                if (!exito) return NotFound(new { mensaje = "Proyecto no encontrado o ya fue eliminado." });

                return Ok(new { mensaje = "Proyecto eliminado lógicamente del sistema." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        [HttpPut("{id}/alcance")]
        public async Task<ActionResult> ActualizarAlcance(int id, [FromBody] AlcanceUpdateDTO dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { mensaje = "El cuerpo de la petición no puede estar vacío." });
                }

                bool exito = await _repository.ActualizarAlcanceAsync(id, dto.Alcance);

                if (!exito)
                {
                    return NotFound(new { mensaje = $"No se encontró el proyecto con ID {id} o está inactivo." });
                }

                return Ok(new { mensaje = "Alcance actualizado correctamente en la base de datos." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno al actualizar el alcance.", detalle = ex.Message });
            }
        }
    }
}