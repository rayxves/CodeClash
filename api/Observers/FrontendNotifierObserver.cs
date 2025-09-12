
using Dtos;
using Services.Extensions;

namespace Observers;

public class FrontendNotifierObserver : IObserver
{

    public Task UpdateAsync(SubmissionSuccessContext context)
    {
        int points = ProblemHelperServices.GetPointsForDifficulty(context.Problem.Difficulty);
        context.ResultDto.Notification = $"Parabéns! Você resolveu o problema e ganhou {points} pontos!";
        context.ResultDto.PointsGained = points;

        return Task.CompletedTask;
    }

}