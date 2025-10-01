using Data;
using Dtos;
using Microsoft.EntityFrameworkCore;
using Services.Extensions;

namespace Observers;

public class SolutionPersistenceObserver : IObserver
{
    private readonly ApplicationDbContext _context;

    public SolutionPersistenceObserver(ApplicationDbContext context)
    {

        _context = context;

    }

    public async Task UpdateAsync(SubmissionSuccessContext context)
    {
        var solution = await _context.UserProblemSolutions
           .FirstOrDefaultAsync(s => s.Id == context.Solution.Id);

        if (solution == null) return;

        int points = ProblemHelperServices.GetPointsForDifficulty(context.Problem.Difficulty);

        solution.IsApproved = true;
        solution.PointsEarned = points;
        solution.MessageOutput = "Todos os testes passaram.";

        _context.UserProblemSolutions.Update(solution);
        await _context.SaveChangesAsync();
    }


}