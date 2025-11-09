using Dtos;
using Interfaces;
using Services.Extensions;

namespace Observers;

public class PointsObserver : IObserver
{
    private readonly IUserRepository _userRepository;

    public PointsObserver(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task UpdateAsync(SubmissionSuccessContext context)
    {
        var user = await _userRepository.GetByIdAsync(context.UserId);
        if (user == null) return;

        int points = ProblemHelperServices.GetPointsForDifficulty(context.Problem.Difficulty);
        user.TotalPoints += points;

        await _userRepository.UpdateAsync(user);
    }
}