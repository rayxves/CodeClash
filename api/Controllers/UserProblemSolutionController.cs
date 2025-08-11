using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace Controllers
{
    [Route("api/user-problem-solutions")]
    [ApiController]
    public class UserProblemSolutionController : ControllerBase
    {
        private readonly IUserProblemSolutionServices _userProblemSolutionInterface;
        private readonly UserManager<User> _userManager;

        public UserProblemSolutionController(IUserProblemSolutionServices userProblemSolutionInterface,
            UserManager<User> userManager)
        {
            _userManager = userManager;
            _userProblemSolutionInterface = userProblemSolutionInterface;
        }

        [Authorize]
        [HttpPost("new-solution")]
        public async Task<ActionResult<UserProblemSolutionDto>> CreateUserProblemSolution([FromBody] UserProblemSolutionDto solutionDto)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized("User not found.");
                }
                var result = await _userProblemSolutionInterface.CreateUserProblemSolutionAsync(solutionDto, user.Id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<ActionResult<List<UserProblemSolution>>> GetAllUserProblemSolutions()
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized("User not found.");
                }

                var solutions = await _userProblemSolutionInterface.GetAllUserProblemSolutionsAsync(user.Id);
                return Ok(solutions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("{problemId}")]
        public async Task<ActionResult<UserProblemSolution>> GetUserProblemSolution(int problemId)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized("User not found.");
                }
                var solution = await _userProblemSolutionInterface.GetUserProblemSolutionAsync(user.Id, problemId);
                return Ok(solution);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

    }
}