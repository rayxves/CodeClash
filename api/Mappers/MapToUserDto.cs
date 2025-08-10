using Dtos;
using Models;

namespace Mappers
{
    public static class MapToUserDto
    {
        public static UserDto ToUserDto(this User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Token = user.Token,
                TotalPoints = user.TotalPoints
            };
        }
    }
}