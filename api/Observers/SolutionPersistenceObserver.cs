using Dtos;
using Interfaces;
using Services.Extensions;

namespace Observers;

public class SolutionPersistenceObserver : IObserver
{
    private readonly IUserProblemSolutionRepository _solutionRepository;

    public SolutionPersistenceObserver(IUserProblemSolutionRepository solutionRepository)
    {
        _solutionRepository = solutionRepository;
    }

    public async Task UpdateAsync(SubmissionSuccessContext context)
    {
        var solution = await _solutionRepository.GetByIdAsync(context.Solution.Id);
        if (solution == null) return;

        int points = ProblemHelperServices.GetPointsForDifficulty(context.Problem.Difficulty);

        solution.IsApproved = true;
        solution.PointsEarned = points;
        solution.MessageOutput = "Todos os testes passaram.";

        await _solutionRepository.UpdateAsync(solution);
        await _solutionRepository.SaveChangesAsync();
    }
}