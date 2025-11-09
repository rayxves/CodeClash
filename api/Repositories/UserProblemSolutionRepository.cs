using Data;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Repositories;

public class UserProblemSolutionRepository : IUserProblemSolutionRepository
{
    private readonly ApplicationDbContext _context;

    public UserProblemSolutionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProblemSolution?> GetByIdAsync(int id)
    {
        return await _context.UserProblemSolutions
            .Include(ups => ups.Problem)
                .ThenInclude(p => p.TestCases)
            .Include(ups => ups.User)
            .FirstOrDefaultAsync(ups => ups.Id == id);
    }

    public async Task<UserProblemSolution?> GetByUserAndProblemAsync(string userId, int problemId)
    {
        return await _context.UserProblemSolutions
            .Include(ups => ups.Problem)
                .ThenInclude(p => p.TestCases)
            .Include(ups => ups.User)
            .FirstOrDefaultAsync(s => s.UserId == userId && s.ProblemId == problemId);
    }

    public async Task<List<UserProblemSolution>> GetAllByUserAsync(string userId)
    {
        return await _context.UserProblemSolutions
            .Where(ups => ups.UserId == userId)
            .Include(ups => ups.Problem)
                .ThenInclude(p => p.TestCases)
            .Include(ups => ups.User)
            .ToListAsync();
    }

    public async Task<UserProblemSolution> AddAsync(UserProblemSolution solution)
    {
        _context.UserProblemSolutions.Add(solution);
        return solution;
    }

    public async Task<UserProblemSolution> UpdateAsync(UserProblemSolution solution)
    {
        _context.UserProblemSolutions.Update(solution);
        return solution;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var solution = await _context.UserProblemSolutions.FindAsync(id);
        if (solution == null) return false;

        _context.UserProblemSolutions.Remove(solution);
        return true;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}