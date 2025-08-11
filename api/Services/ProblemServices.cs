using Data;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services
{
    public class ProblemServices : IProblemServices
    {
        private readonly ApplicationDbContext _context;
        public ProblemServices(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<Problem>> GetAllProblemsAsync()
        {
            return await _context.Problems.Include(p => p.TestCases).ToListAsync();
        }

        public Task<List<Problem>> GetAllProblemsByFilterAsync(string? category, string? difficulty, string? description)
        {
            var query = _context.Problems.Include(p => p.TestCases).AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrEmpty(difficulty))
            {
                query = query.Where(p => p.Difficulty.ToLower() == difficulty.ToLower());
            }

            if (!string.IsNullOrEmpty(description))
            {
                query = query.Where(p => p.Description.Contains(description));
            }

            return query.ToListAsync();
        }

        public async Task<Problem> GetProblemByIdAsync(int id)
        {
            var problem = await _context.Problems.Include(p => p.TestCases)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (problem == null)
            {
                throw new InvalidOperationException($"Problem with ID '{id}' not found.");
            }

            return problem;
        }

        public async Task<Problem> GetProblemByTitleAndDescriptionAndAsync(string title, string description)
        {
            var problem = await _context.Problems.Include(p => p.TestCases)
                .FirstOrDefaultAsync(p => p.Title.ToLower() == title.ToLower() && p.Description.Contains(description));

            if (problem == null)
            {
                throw new InvalidOperationException($"Problem with title '{title}' and description '{description}' not found.");
            }

            return problem;
        }
    }
}