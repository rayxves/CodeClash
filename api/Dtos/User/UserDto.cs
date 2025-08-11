namespace Dtos
{
    public class UserDto
    {
        public string Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public int TotalPoints { get; set; }
    }
}