using Models;

namespace Interfaces
{
    public interface IProblemServices
    {
        Task<List<Problem>> GetAllProblemsAsync();
        Task<List<Problem>> GetAllProblemsByFilterAsync(string? category, string? difficulty, string? description);
        Task<Problem> GetProblemByIdAsync(int id);
        Task<Problem> GetProblemByTitleAndDescriptionAndAsync(string title, string description);
    }
}