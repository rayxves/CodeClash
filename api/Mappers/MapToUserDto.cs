using Dtos;
using Models;

namespace Mappers
{
    public static class MapToUserDto
    {
        public static UserDto ToUserDto(this User user, string token)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Token = token,
                TotalPoints = user.TotalPoints
            };
        }
    }
}