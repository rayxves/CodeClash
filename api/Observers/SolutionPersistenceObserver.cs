using Data;
using Dtos;
using Services.Extensions;

namespace Observers;

public class SolutionPersistenceObserver : IObserver
{
    private readonly ApplicationDbContext _context;

    public SolutionPersistenceObserver(ApplicationDbContext context, ISubject submissionPublisher)
    {
  
        _context = context;
      
    }

    public Task UpdateAsync(SubmissionSuccessContext context)
    {
        int points = ProblemHelperServices.GetPointsForDifficulty(context.Problem.Difficulty);

        context.Solution.IsApproved = true;
        context.Solution.PointsEarned = points;
        context.Solution.MessageOutput = "Todos os testes passaram.";

        _context.UserProblemSolutions.Update(context.Solution);
        return Task.CompletedTask;
    }


}