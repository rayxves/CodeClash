using Models;

namespace Interfaces
{
    public interface IUserProblemSolutionInterface
    {
        Task<UserProblemSolution> GetUserProblemSolutionAsync(string userId, int problemId);
        Task<List<UserProblemSolution>> GetAllUserProblemSolutionsAsync(string userId);
        Task<UserProblemSolution> CreateUserProblemSolutionAsync(UserProblemSolutionDto userProblemSolution, string userId);
        Task<UserProblemSolution> UpdateUserProblemSolutionAsync(UserProblemSolutionDto userProblemSolution);
        Task<bool> DeleteUserProblemSolutionAsync(int id);
    }
}