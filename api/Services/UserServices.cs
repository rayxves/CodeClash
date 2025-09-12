using Data;
using Dtos;
using Interfaces;
using Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;

public class UserServices : IUserServices
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly TokenServices _tokenServices;

    public UserServices(ApplicationDbContext context, UserManager<User> userManager, TokenServices tokenServices)
    {
        _userManager = userManager;
        _context = context;
        _tokenServices = tokenServices;
    }

    public async Task<UserDto> GetUserByUsernameAsync(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
        if (user == null) throw new InvalidOperationException($"User with username '{username}' not found.");

        var token = _tokenServices.GenerateToken(user);
        return user.ToUserDto(token);
    }

    public async Task<object> GetCompleteUserProfileAsync(string username)
    {
        var result = await _context.Users
            .Where(u => u.UserName.ToLower() == username.ToLower())
            .Select(u => new {
                User = new { u.Id, u.UserName, u.Email, u.TotalPoints },
                Solutions = u.UserProblemSolutions
                    .Select(ups => new {
                        ups.Id,
                        ups.ProblemId,
                        ups.Language,
                        ups.Code,
                        ups.IsApproved,
                        ups.PointsEarned,
                        ups.MessageOutput,
                        ups.SolvedAt,
                        Problem = new {
                            ups.Problem.Id,
                            ups.Problem.Title,
                            ups.Problem.Difficulty,
                            ups.Problem.Category
                        }
                    })
                    .OrderByDescending(ups => ups.SolvedAt)
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (result == null) throw new InvalidOperationException($"User with username '{username}' not found.");

        return result;
    }

    public async Task<UserDto> LoginUserAsync(UserLoginDto loginDto)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.UserName);
        if (user == null) throw new InvalidOperationException("Usuário não encontrado.");

        var passwordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!passwordValid) throw new InvalidOperationException("Senha inválida.");

        var token = _tokenServices.GenerateToken(user);
        return user.ToUserDto(token);
    }

    public async Task<UserDto> RegisterUserAsync(UserRegisterDto registerDto)
    {
        var userExists = await _userManager.FindByNameAsync(registerDto.UserName);
        if (userExists != null) throw new InvalidOperationException("Nome de usuário já existe.");

        var user = new User
        {
            UserName = registerDto.UserName,
            Email = registerDto.Email,
            TotalPoints = 0
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) throw new InvalidOperationException("Erro ao tentar criar o usuário.");

        await _context.SaveChangesAsync();
        var token = _tokenServices.GenerateToken(user);

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return user.ToUserDto(token);
    }
}
