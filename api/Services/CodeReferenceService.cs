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
        var entity = new CodeReferenceEntity
        {
            Name = name,
            Category = category,
            Language = language,
            Code = code,
            Description = description,
            ParentId = parentId
        };

        _context.CodeReferences.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<object>> SearchAsync(string? language = null, string? category = null, string? name = null)
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

        var matchedIds = await query.Select(e => e.Id).ToListAsync();
        if (!matchedIds.Any()) return Enumerable.Empty<object>();

        var allResults = await GetAllDescendantsAsync(matchedIds);

        return allResults.Select(e => new
        {
            e.Id,
            e.Name,
            e.Category,
            e.Language,
            e.Code,
            e.Description,
            e.ParentId
        });
    }

    public async Task<IEnumerable<object>> RecommendSimilarAsync(string userCodeAttempt, int take = 5)
    {
        var concepts = userCodeAttempt.ExtractCodeConcepts();
        if (!concepts.Any()) return Enumerable.Empty<object>();

        var potentialMatches = _context.CodeReferences
        .Where(e => !string.IsNullOrEmpty(e.Code))
        .AsEnumerable()
        .Where(e => concepts.Any(c =>
            e.Name.Contains(c, StringComparison.OrdinalIgnoreCase) ||
            e.Code.Contains(c, StringComparison.OrdinalIgnoreCase) ||
            e.Description.Contains(c, StringComparison.OrdinalIgnoreCase) ||
            e.Category.Contains(c, StringComparison.OrdinalIgnoreCase)))
        .ToList();


        var topMatches = potentialMatches.GetTopMatches(concepts, take);

        return topMatches.Select(e => new { e.Name, e.Category, e.Language, e.Code, e.Description });
    }


    public async Task<CodeComponent?> BuildTreeForLanguageAsync(string language)
    {
        var allEntities = await _context.CodeReferences
            .Where(e => e.Language.ToLower() == language.ToLower())
            .AsNoTracking() 
            .ToListAsync();

        if (!allEntities.Any()) return null;

        var virtualRoot = new CodeCategory(new CodeReferenceEntity
        {
            Id = 0, 
            Name = language,
            Language = language,
            Description = $"Conteúdo principal para a linguagem {language}"
        });

        var map = allEntities.ToDictionary(
            e => e.Id,
            e => string.IsNullOrEmpty(e.Code) ? (CodeComponent)new CodeCategory(e) : new CodeAlgorithm(e)
        );

        foreach (var entity in allEntities)
        {
            if (entity.ParentId.HasValue && map.TryGetValue(entity.ParentId.Value, out var parent))
            {
                parent.Add(map[entity.Id]);
            }
            else if (!entity.ParentId.HasValue)
            {
                virtualRoot.Add(map[entity.Id]);
            }
        }

        return virtualRoot;
    }

    public CodeComponentDto MapComponentToDto(CodeComponent component)
    {
        var dto = new CodeComponentDto
        {
            Id = component.Id,
            Name = component.Name,
            Category = component.Category,
            Language = component.Language,
            Description = component.Description,
            Children = component.GetChildren().Select(MapComponentToDto).ToList()
        };

        if (component is CodeAlgorithm algorithm)
        {
            dto.Code = algorithm.Code;
        }

        return dto;
    }
    public async Task<object> GetByIdAsync(int id)
    {
        var entity = await _context.CodeReferences
            .Where(e => e.Id == id)
            .Select(e => new { e.Name, e.Category, e.Language, e.Code, e.Description })
            .FirstOrDefaultAsync();

        if (entity == null)
            throw new KeyNotFoundException($"Code reference with ID '{id}' not found.");

        return entity;
    }

    public async Task<List<CodeReferenceEntity>> GetAllDescendantsAsync(List<int> parentIds)
    {
        if (!parentIds.Any()) return new List<CodeReferenceEntity>();

        var allEntities = await _context.CodeReferences.ToListAsync();
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

    public async Task<CategoryViewDto?> GetCategoryViewAsync(string language, string? categoryName = null)
    {
        var allEntities = await _context.CodeReferences
            .Where(e => e.Language.ToLower() == language.ToLower())
            .AsNoTracking()
            .ToListAsync();

        if (!allEntities.Any()) return null;

        var view = new CategoryViewDto();

        if (string.IsNullOrWhiteSpace(categoryName))
        {
            view.CurrentCategory = null;
            view.Children = BuildNestedChildren(null, allEntities);
            view.Breadcrumbs = new List<CodeReferenceDto>();
        }
        else
        {
            var current = allEntities.FirstOrDefault(e => e.Name.Equals(categoryName, StringComparison.OrdinalIgnoreCase));
            if (current == null) return null;

            view.CurrentCategory = current.ToDto();
            view.Children = BuildNestedChildren(current.Id, allEntities);

            var breadcrumbs = new List<CodeReferenceEntity>();
            var parentId = current.ParentId;
            var map = allEntities.ToDictionary(e => e.Id);

            while (parentId.HasValue && map.TryGetValue(parentId.Value, out var parent))
            {
                breadcrumbs.Add(parent);
                parentId = parent.ParentId;
            }

            breadcrumbs.Reverse();
            view.Breadcrumbs = breadcrumbs.Select(e => e.ToDto()).ToList();
        }

        return view;
    }

    private List<CodeReferenceDto> BuildNestedChildren(int? parentId, List<CodeReferenceEntity> allEntities)
    {
        return allEntities
            .Where(e => e.ParentId == parentId)
            .Select(e =>
            {
                var dto = e.ToDto();
                dto.Children = BuildNestedChildren(e.Id, allEntities);
                return dto;
            })
            .ToList();
    }

}
