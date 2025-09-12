using Dtos;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserServices _userInterface;

        public UserController(IUserServices userInterface)
        {
            _userInterface = userInterface;
        }

        [Authorize]
        [HttpGet("get-user")]
        public async Task<ActionResult<User>> GetUser()
        {
            try
            {
                var username = User.Identity?.Name;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated.");
                }
                var user = await _userInterface.GetUserByUsernameAsync(username);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("profile/complete")]
        public async Task<ActionResult> GetCompleteProfile()
        {
            try
            {
                var username = User.Identity?.Name;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated.");
                }
                
                var completeProfile = await _userInterface.GetCompleteUserProfileAsync(username);
                return Ok(completeProfile);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> RegisterUser([FromBody] UserRegisterDto registerDto)
        {
            try
            {
                var user = await _userInterface.RegisterUserAsync(registerDto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> LoginUser([FromBody] UserLoginDto loginDto)
        {
            try
            {
                var user = await _userInterface.LoginUserAsync(loginDto);
                if (user == null)
                {
                    return Unauthorized("Invalid username or password.");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}