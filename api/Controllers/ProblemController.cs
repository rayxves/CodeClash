using Dtos;
using Interfaces;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace Controllers
{
    [Route("api/problems")]
    [ApiController]
    public class ProblemController : ControllerBase
    {
        private readonly IProblemServices _problemInterface;

        public ProblemController(IProblemServices problemInterface)
        {
            _problemInterface = problemInterface;
        }

        [HttpGet()]
        public async Task<ActionResult<List<Problem>>> GetAllProblems()
        {
            var problems = await _problemInterface.GetAllProblemsAsync();
            return Ok(problems);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Problem>> GetProblemById(int id)
        {
            try
            {
                var problem = await _problemInterface.GetProblemByIdAsync(id);
                return Ok(problem);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("filter")]
        public async Task<ActionResult<List<Problem>>> GetProblemsByFilter([FromQuery] string? category,
            [FromQuery] string? difficulty,
            [FromQuery] string? description)
        {
            try
            {
                var problems = await _problemInterface.GetAllProblemsByFilterAsync(category, difficulty, description);
                return Ok(problems);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }

        }

        [HttpGet("by-title-and-description")]
        public async Task<ActionResult<Problem>> GetProblemByTitleAndDescription([FromQuery] string title,
            [FromQuery] string description)
        {
            try
            {
                var problem = await _problemInterface.GetProblemByTitleAndDescriptionAndAsync(title, description);
                return Ok(problem);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }



    }
}