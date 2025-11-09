using Models;

namespace Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetCompleteProfileAsync(string username);
    Task<User> UpdateAsync(User user);
    Task<int> SaveChangesAsync();
}