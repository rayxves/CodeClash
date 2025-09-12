using Data;
using Dtos;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Services.Extensions;

namespace Observers;

public class PointsObserver : IObserver
{
    private readonly ApplicationDbContext _context;

    public PointsObserver(ApplicationDbContext context)
    {
        _context = context;
    }


    public async Task UpdateAsync(SubmissionSuccessContext context)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == context.UserId);
        if (user == null) return;

        int points = ProblemHelperServices.GetPointsForDifficulty(context.Problem.Difficulty);
        user.TotalPoints += points;

        _context.Users.Update(user);

    }

}