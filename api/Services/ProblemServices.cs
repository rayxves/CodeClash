using Interfaces;
using Models;

namespace Services;

public class ProblemServices : IProblemServices
{
    private readonly IProblemRepository _repository;

    public ProblemServices(IProblemRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Problem>> GetAllProblemsAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<List<Problem>> GetAllProblemsByFilterAsync(string? category, string? difficulty, string? description)
    {
        return await _repository.GetByFilterAsync(category, difficulty, description);
    }

    public async Task<Problem> GetProblemByIdAsync(int id)
    {
        var problem = await _repository.GetByIdAsync(id);

        if (problem == null)
            throw new InvalidOperationException($"Problem with ID '{id}' not found.");

        return problem;
    }

    public async Task<Problem> GetProblemByTitleAndDescriptionAndAsync(string title, string description)
    {
        var problem = await _repository.GetByTitleAndDescriptionAsync(title, description);

        if (problem == null)
            throw new InvalidOperationException($"Problem with title '{title}' and description '{description}' not found.");

        return problem;
    }
}