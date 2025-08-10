using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Models;

namespace Services
{
    public class TokenServices
    {
        private readonly IConfiguration _configuration;
        public TokenServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        
        public string GenerateToken(User user)
        {
            var signingKey = _configuration.GetValue<string>("JWT:SigningKey")
                ?? throw new InvalidOperationException("JWT:SigningKey não configurado.");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}