using Dtos;

namespace Interfaces
{
    public interface IUserInterface
    {
        Task<UserDto> RegisterUserAsync(UserRegisterDto registerDto);
        Task<UserDto> LoginUserAsync(UserLoginDto loginDto);
        Task<UserDto> GetUserByUsernameAsync(string username);

    }
}