using Composites;
using Dtos;
using Interfaces;
using Mappers;
using Models;
using Services.Extensions;

namespace Services;

public class CodeReferenceService : ICodeReferenceServices
{
    private readonly ICodeReferenceRepository _repository;
    private readonly ICodeComponentFactory _componentFactory;

    public CodeReferenceService(ICodeReferenceRepository repository, ICodeComponentFactory componentFactory)
    {
        _repository = repository;
        _componentFactory = componentFactory;
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

        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<object>> SearchAsync(string? language = null, string? category = null, string? name = null)
    {
        var matchedEntities = await _repository.SearchAsync(language, category, name);
        var matchedIds = matchedEntities.Select(e => e.Id).ToList();

        if (!matchedIds.Any()) return Enumerable.Empty<object>();

        var allResults = await _repository.GetAllDescendantsAsync(matchedIds);

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

        var allEntities = await _repository.GetAllAsync();

        var potentialMatches = allEntities
            .Where(e => !string.IsNullOrEmpty(e.Code))
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
        var allEntities = await _repository.GetByLanguageAsync(language);

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
            e => _componentFactory.CreateComponent(e)
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
        var entity = await _repository.GetByIdAsync(id);

        if (entity == null)
            throw new KeyNotFoundException($"Code reference with ID '{id}' not found.");

        return new { entity.Name, entity.Category, entity.Language, entity.Code, entity.Description };
    }

    public async Task<List<CodeReferenceEntity>> GetAllDescendantsAsync(List<int> parentIds)
    {
        return await _repository.GetAllDescendantsAsync(parentIds);
    }

    public async Task<CategoryViewDto?> GetCategoryViewAsync(string language, string? categoryName = null)
    {
        var allEntities = await _repository.GetByLanguageAsync(language);

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