using Data;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Repositories;

public class CodeReferenceRepository : ICodeReferenceRepository
{
    private readonly ApplicationDbContext _context;

    public CodeReferenceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CodeReferenceEntity?> GetByIdAsync(int id)
    {
        return await _context.CodeReferences
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<CodeReferenceEntity>> GetAllAsync()
    {
        return await _context.CodeReferences
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<CodeReferenceEntity>> GetByLanguageAsync(string language)
    {
        return await _context.CodeReferences
            .Where(e => e.Language.ToLower() == language.ToLower())
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<CodeReferenceEntity>> SearchAsync(string? language, string? category, string? name)
    {
        var query = _context.CodeReferences.AsQueryable();

        if (!string.IsNullOrWhiteSpace(language))
            query = query.Where(e => e.Language.ToLower() == language.ToLower());

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(e => e.Category.ToLower() == category.ToLower());

        if (!string.IsNullOrWhiteSpace(name))
        {
            var lowerName = name.ToLower().Trim();
            query = query.Where(e => EF.Functions.Like(e.Name.ToLower(), $"%{lowerName}%"));
        }

        return await query.ToListAsync();
    }

    public async Task<List<CodeReferenceEntity>> GetAllDescendantsAsync(List<int> parentIds)
    {
        if (!parentIds.Any()) return new List<CodeReferenceEntity>();

        var allEntities = await GetAllAsync();
        var result = new List<CodeReferenceEntity>();
        var queue = new Queue<int>(parentIds);

        while (queue.Any())
        {
            var currentId = queue.Dequeue();
            var children = allEntities.Where(e => e.ParentId == currentId).ToList();

            foreach (var child in children)
            {
                result.Add(child);
                queue.Enqueue(child.Id);
            }
        }

        result.AddRange(allEntities.Where(e => parentIds.Contains(e.Id)));
        return result.Distinct().ToList();
    }

    public async Task<CodeReferenceEntity> AddAsync(CodeReferenceEntity entity)
    {
        _context.CodeReferences.Add(entity);
        return entity;
    }

    public async Task AddRangeAsync(IEnumerable<CodeReferenceEntity> entities)
    {
        await _context.CodeReferences.AddRangeAsync(entities);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}