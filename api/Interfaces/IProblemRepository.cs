using Models;

namespace Interfaces;

public interface IProblemRepository
{
    Task<Problem?> GetByIdAsync(int id);
    Task<List<Problem>> GetAllAsync();
    Task<List<Problem>> GetByFilterAsync(string? category, string? difficulty, string? description);
    Task<Problem?> GetByTitleAndDescriptionAsync(string title, string description);
}