using Data;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Models;

namespace Services
{
    public class ProblemServices : IProblemServices
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;
        
        public ProblemServices(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }
        
        public async Task<List<Problem>> GetAllProblemsAsync()
        {
            const string cacheKey = "all_problems";
            
            if (_cache.TryGetValue(cacheKey, out List<Problem> cachedProblems))
                return cachedProblems;

            var problems = await _context.Problems
                .Include(p => p.TestCases)
                .AsNoTracking()
                .ToListAsync();
                
            _cache.Set(cacheKey, problems, TimeSpan.FromMinutes(15));
            return problems;
        }

        public async Task<List<Problem>> GetAllProblemsByFilterAsync(string? category, string? difficulty, string? description)
        {
            var cacheKey = $"problems_filter_{category}_{difficulty}_{description}";
            
            if (_cache.TryGetValue(cacheKey, out List<Problem> cachedResults))
                return cachedResults;

            var query = _context.Problems.Include(p => p.TestCases).AsNoTracking().AsQueryable();

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
                query = query.Where(p => EF.Functions.Like(p.Description, $"%{description}%"));
            }

            var results = await query.ToListAsync();
            _cache.Set(cacheKey, results, TimeSpan.FromMinutes(10));
            return results;
        }

        public async Task<Problem> GetProblemByIdAsync(int id)
        {
            var cacheKey = $"problem_{id}";
            
            if (_cache.TryGetValue(cacheKey, out Problem cachedProblem))
                return cachedProblem;

            var problem = await _context.Problems
                .Include(p => p.TestCases)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (problem == null)
            {
                throw new InvalidOperationException($"Problem with ID '{id}' not found.");
            }

            _cache.Set(cacheKey, problem, TimeSpan.FromMinutes(30));
            return problem;
        }

        public async Task<Problem> GetProblemByTitleAndDescriptionAndAsync(string title, string description)
        {
            var cacheKey = $"problem_title_desc_{title}_{description}";
            
            if (_cache.TryGetValue(cacheKey, out Problem cachedProblem))
                return cachedProblem;

            var problem = await _context.Problems
                .Include(p => p.TestCases)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Title.ToLower() == title.ToLower() && 
                                         EF.Functions.Like(p.Description, $"%{description}%"));

            if (problem == null)
            {
                throw new InvalidOperationException($"Problem with title '{title}' and description '{description}' not found.");
            }

            _cache.Set(cacheKey, problem, TimeSpan.FromMinutes(30));
            return problem;
        }
    }
}