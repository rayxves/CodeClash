using Data;
using Dtos;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services
{
    public class UserProblemSolutionServices : IUserProblemSolutionServices
    {
        private readonly ApplicationDbContext _context;

        public UserProblemSolutionServices(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserProblemSolution> CreateInitialSubmissionAsync(string userId, int problemId, string language, string code)
        {
            var existingSolution = await _context.UserProblemSolutions
        .FirstOrDefaultAsync(s => s.UserId == userId && s.ProblemId == problemId);

            if (existingSolution != null)
            {

                return existingSolution;
            }

            var solution = new UserProblemSolution
            {
                UserId = userId,
                ProblemId = problemId,
                Language = language,
                Code = code,
                SolvedAt = DateTime.UtcNow,
                IsApproved = false,
                PointsEarned = 0,
                MessageOutput = "Em processamento..."
            };

            _context.UserProblemSolutions.Add(solution);
            await _context.SaveChangesAsync();
            return solution;
        }

        public async Task<UserProblemSolution> CreateUserProblemSolutionAsync(UserProblemSolutionDto userProblemSolution, string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException($"User with ID '{userId}' not found.");
            }
            var problem = await _context.Problems.Include(p => p.TestCases).FirstOrDefaultAsync(p => p.Id == userProblemSolution.ProblemId);
            if (problem == null)
            {
                throw new InvalidOperationException($"Problem with ID '{userProblemSolution.ProblemId}' not found.");
            }
            var solution = new UserProblemSolution
            {
                UserId = userId,
                User = user,
                ProblemId = userProblemSolution.ProblemId,
                Problem = problem,
                PointsEarned = userProblemSolution.PointsEarned,
                SolvedAt = userProblemSolution.SolvedAt,
                Language = userProblemSolution.Language,
                Code = userProblemSolution.Code,
                MessageOutput = userProblemSolution.MessageOutput,
                IsApproved = userProblemSolution.IsApproved
            };
            _context.UserProblemSolutions.Add(solution);
            await _context.SaveChangesAsync();
            return solution;
        }

        public async Task<bool> DeleteUserProblemSolutionAsync(int id)
        {
            var solution = await _context.UserProblemSolutions.FindAsync(id);
            if (solution == null)
            {
                throw new InvalidOperationException($"UserProblemSolution with ID '{id}' not found.");
            }
            _context.UserProblemSolutions.Remove(solution);
            return await _context.SaveChangesAsync().ContinueWith(t => t.Result > 0);
        }

        public async Task<List<UserProblemSolution>> GetAllUserProblemSolutionsAsync(string userId)
        {
            return await _context.UserProblemSolutions
                .Where(ups => ups.UserId == userId)
                .Include(ups => ups.Problem)
                .ThenInclude(p => p.TestCases)
                .Include(ups => ups.User)
                .ToListAsync();
        }

        public async Task<UserProblemSolution> GetUserProblemSolutionAsync(string userId, int problemId)
        {
            var solution = await _context.UserProblemSolutions
                .Include(ups => ups.Problem)
                .ThenInclude(p => p.TestCases)
                .Include(ups => ups.User)
                .FirstOrDefaultAsync(ups => ups.UserId == userId && ups.ProblemId == problemId);

            if (solution == null)
            {
                throw new InvalidOperationException($"UserProblemSolution for User ID '{userId}' and Problem ID '{problemId}' not found.");
            }
            return solution;
        }

        public async Task<UserProblemSolution> UpdateUserProblemSolutionAsync(UserProblemSolutionDto userProblemSolution)
        {
            var existingSolution = await _context.UserProblemSolutions
                .FirstOrDefaultAsync(s => s.UserId == userProblemSolution.UserId && s.ProblemId == userProblemSolution.ProblemId);
            if (existingSolution == null)
            {
                throw new InvalidOperationException($"UserProblemSolution with ID '{userProblemSolution.ProblemId}' not found.");
            }

            existingSolution.PointsEarned = userProblemSolution.PointsEarned;
            existingSolution.SolvedAt = userProblemSolution.SolvedAt;
            existingSolution.Language = userProblemSolution.Language;
            existingSolution.Code = userProblemSolution.Code;
            existingSolution.MessageOutput = userProblemSolution.MessageOutput;
            existingSolution.IsApproved = userProblemSolution.IsApproved;

            _context.UserProblemSolutions.Update(existingSolution);
            await _context.SaveChangesAsync();

            return existingSolution;
        }
    }
}