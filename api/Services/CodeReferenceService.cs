using Composites;
using Data;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Models;
using Services.Extensions;

namespace Services;

public class CodeReferenceService : ICodeReferenceServices
{
    private readonly ApplicationDbContext _context;

    public CodeReferenceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CodeReferenceEntity> AddReferenceAsync(string name, string category, string language, string code, string description, int? parentId)
    {
        var newEntity = new CodeReferenceEntity
        {
            Name = name,
            Category = category,
            Language = language,
            Code = code,
            Description = description,
            ParentId = parentId
        };

        _context.CodeReferences.Add(newEntity);
        await _context.SaveChangesAsync();

        return newEntity;
    }

    public async Task<IEnumerable<object>> SearchAsync(string? language = null, string? category = null, string? name = null)
    {
        var query = _context.CodeReferences.AsQueryable();

        if (!string.IsNullOrWhiteSpace(language))
        {
            query = query.Where(e => e.Language.Equals(language, StringComparison.OrdinalIgnoreCase));
        }
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(e => e.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        }
        if (!string.IsNullOrWhiteSpace(name))
        {
            var lowerName = name.ToLower().Trim();
            query = query.Where(e => e.Name.ToLower().Contains(lowerName));
        }

        return await query
            .Select(e => new { e.Name, e.Category, e.Language, e.Code, e.Description })
            .ToListAsync();
    }

    public async Task<IEnumerable<object>> RecommendSimilarAsync(string userCodeAttempt, int take = 5)
    {
        var userConcepts = userCodeAttempt.ExtractCodeConcepts();

        if (!userConcepts.Any())
        {
            return Enumerable.Empty<object>();
        }

        var potentialMatches = await _context.CodeReferences
            .Where(e => !string.IsNullOrEmpty(e.Code) && userConcepts.Any(kw => e.Name.Contains(kw) || e.Code.Contains(kw)))
            .Take(50)
            .ToListAsync();

        var topMatches = potentialMatches.GetTopMatches(userConcepts, take);

        return topMatches.Select(e => new { e.Name, e.Category, e.Language, e.Code, e.Description });
    }

    public async Task<CodeComponent?> BuildTreeForLanguageAsync(string language)
    {
        var allLanguageEntities = await _context.CodeReferences
            .Where(e => e.Language.Equals(language, StringComparison.OrdinalIgnoreCase))
            .ToListAsync();

        if (!allLanguageEntities.Any()) return null;

        var rootEntity = allLanguageEntities.FirstOrDefault(e => e.ParentId == null);
        if (rootEntity == null) return null;

        var componentMap = allLanguageEntities.ToDictionary(
            e => e.Id,
            e => string.IsNullOrEmpty(e.Code) ? (CodeComponent)new CodeCategory(e) : new CodeAlgorithm(e)
        );

        foreach (var entity in allLanguageEntities)
        {
            if (entity.ParentId.HasValue && componentMap.TryGetValue(entity.ParentId.Value, out var parent))
            {
                parent.Add(componentMap[entity.Id]);
            }
        }

        return componentMap[rootEntity.Id];
    }

    public async Task<object> GetByIdAsync(int id)
    {
        var entity = await _context.CodeReferences
            .Where(e => e.Id == id)
            .Select(e => new { e.Name, e.Category, e.Language, e.Code, e.Description })
            .FirstOrDefaultAsync();

        if (entity == null)
        {
            throw new KeyNotFoundException($"Code reference with ID '{id}' not found.");
        }

        return entity;
    }

}