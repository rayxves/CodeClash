using Composites;
using Data;
using Dtos;
using Interfaces;
using Mappers;
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
            query = query.Where(e => e.Language.ToLower() == language.ToLower());

        }
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(e => e.Category.ToLower() == category.ToLower());
        }
        if (!string.IsNullOrWhiteSpace(name))
        {
            var lowerName = name.ToLower().Trim();
            query = query.Where(e => e.Name.ToLower().Contains(lowerName));
        }

        var matchedIds = await query.Select(q => q.Id).ToListAsync();

        if (!matchedIds.Any())
            return Enumerable.Empty<object>();

        var allResults = await GetAllDescendantsAsync(matchedIds);

        return allResults
            .Select(e => new
            {
                e.Id,
                e.Name,
                e.Category,
                e.Language,
                e.Code,
                e.Description,
                e.ParentId
            })
            .ToList();
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
            .Where(e => e.Language.ToLower() == language.ToLower())
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

    public async Task<List<CodeReferenceEntity>> GetAllDescendantsAsync(List<int> parentIds)
    {
        var result = new List<CodeReferenceEntity>();
        var queue = new Queue<int>(parentIds);

        while (queue.Any())
        {
            var currentId = queue.Dequeue();

            var children = await _context.CodeReferences
                .Where(e => e.ParentId == currentId)
                .ToListAsync();

            foreach (var child in children)
            {
                result.Add(child);
                queue.Enqueue(child.Id);
            }
        }

        var parents = await _context.CodeReferences
            .Where(e => parentIds.Contains(e.Id))
            .ToListAsync();

        result.AddRange(parents);

        return result;
    }

    public async Task<CategoryViewDto?> GetCategoryViewAsync(string language, string? categoryName = null)
    {
        var view = new CategoryViewDto();

        var allLanguageEntities = await _context.CodeReferences
            .Where(e => e.Language.ToLower() == language.ToLower())
            .ToListAsync();

        if (!allLanguageEntities.Any())
        {
            return null;
        }

        if (string.IsNullOrWhiteSpace(categoryName))
        {
            view.CurrentCategory = null;
            view.Children = BuildNestedChildren(null, allLanguageEntities);
            view.Breadcrumbs = new List<CodeReferenceDto>();
            return view;
        }

        var currentEntity = allLanguageEntities
            .FirstOrDefault(e => e.Name.Equals(categoryName, StringComparison.OrdinalIgnoreCase));

        if (currentEntity == null)
        {
            return null;
        }

        view.CurrentCategory = currentEntity.ToDto();

        view.Children = BuildNestedChildren(currentEntity.Id, allLanguageEntities);

        var breadcrumbs = new List<CodeReferenceEntity>();
        var parentId = currentEntity.ParentId;
        var entityMap = allLanguageEntities.ToDictionary(e => e.Id);

        while (parentId.HasValue && entityMap.TryGetValue(parentId.Value, out var parentEntity))
        {
            breadcrumbs.Add(parentEntity);
            parentId = parentEntity.ParentId;
        }

        breadcrumbs.Reverse();
        view.Breadcrumbs = breadcrumbs.Select(e => e.ToDto()).ToList();

        return view;
    }


    private List<CodeReferenceDto> BuildNestedChildren(int? parentId, List<CodeReferenceEntity> allEntities)
    {
        var children = new List<CodeReferenceDto>();

        var directChildren = allEntities.Where(e => e.ParentId == parentId);

        foreach (var childEntity in directChildren)
        {
            var childDto = childEntity.ToDto();

            childDto.Children = BuildNestedChildren(childEntity.Id, allEntities);

            children.Add(childDto);
        }

        return children;
    }
}