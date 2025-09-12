using Dtos;

namespace Interfaces
{
    public interface IUserServices
    {
        Task<UserDto> RegisterUserAsync(UserRegisterDto registerDto);
        Task<UserDto> LoginUserAsync(UserLoginDto loginDto);
        Task<UserDto> GetUserByUsernameAsync(string username);
        Task<object> GetCompleteUserProfileAsync(string username);

    }
}