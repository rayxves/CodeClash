using Models;

namespace Interfaces;

public interface IUserProblemSolutionRepository
{
    Task<UserProblemSolution?> GetByIdAsync(int id);
    Task<UserProblemSolution?> GetByUserAndProblemAsync(string userId, int problemId);
    Task<List<UserProblemSolution>> GetAllByUserAsync(string userId);
    Task<UserProblemSolution> AddAsync(UserProblemSolution solution);
    Task<UserProblemSolution> UpdateAsync(UserProblemSolution solution);
    Task<bool> DeleteAsync(int id);
    Task<int> SaveChangesAsync();
}