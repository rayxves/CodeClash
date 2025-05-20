using Composites;
using Models;
using Microsoft.EntityFrameworkCore;
using Interfaces;
using Services.Extensions;
using Data;

namespace Services;

public class CodeReferenceService : ICodeReferenceInterface
{
    private readonly ApplicationDbContext _context;

    public CodeReferenceService(ApplicationDbContext context)
    {
        _context = context;
    }

    private async Task<CodeReference> BuildNodeAsync(CodeReferenceEntity entity, List<CodeReferenceEntity> allEntities, bool useComposite = false)
    {
        if (!useComposite)
        {
            return new CodeReference
            {
                Name = entity.Name,
                Category = entity.Category,
                Language = entity.Language,
                Code = entity.Code,
                Description = entity.Description
            };
        }

        var composite = new CodeReferenceComposite
        {
            Name = entity.Name,
            Category = entity.Category,
            Language = entity.Language,
            Code = entity.Code,
            Description = entity.Description
        };

        var children = allEntities.Where(e => e.ParentId == entity.Id).ToList();
        foreach (var child in children)
        {
            composite.AddChild(await BuildNodeAsync(child, allEntities, useComposite: true)); // Recursão com composite
        }

        return composite.Children.Any() ? composite : new CodeReference
        {
            Name = entity.Name,
            Category = entity.Category,
            Language = entity.Language,
            Code = entity.Code,
            Description = entity.Description
        };
    }

    public async Task<CodeReference> BuildCompositeTreeAsync(int? rootId = null)
    {
        var allEntities = await _context.CodeReferences.ToListAsync();
        var rootEntity = rootId == null
            ? allEntities.FirstOrDefault(e => e.ParentId == null)
            : allEntities.FirstOrDefault(e => e.Id == rootId);

        if (rootEntity == null) return null;

        return await BuildNodeAsync(rootEntity, allEntities, useComposite: true); // Usando composite
    }

    public async Task<List<CodeReference>> BuildCompositeForestAsync()
    {
        var allEntities = await _context.CodeReferences.ToListAsync();
        var rootEntities = allEntities.Where(e => e.ParentId == null).ToList();

        var forest = new List<CodeReference>();
        foreach (var rootEntity in rootEntities)
        {
            forest.Add(await BuildNodeAsync(rootEntity, allEntities, useComposite: true)); // Usando composite
        }

        return forest;
    }

    public async Task<IEnumerable<object>> GetByLanguageAsync(string language)
    {
        if (string.IsNullOrWhiteSpace(language)) return Enumerable.Empty<object>();

        var normalizedQuery = CodeAnalysisService.NormalizeCategory(language);
        var roots = await BuildCompositeForestAsync();
        var allMatches = new List<CodeReference>();

        foreach (var root in roots)
        {
            allMatches.AddRange(root.Flatten().Where(reference =>
                CodeAnalysisService.NormalizeCategory(reference.Language).Contains(normalizedQuery)
            ));
        }

        return allMatches.Select(match =>
            match is CodeReferenceComposite composite
                ? composite.ToCardWithChildren()
                : match.ToCardModel()
        );
    }

    public async Task<IEnumerable<object>> GetByCategoryAsync(string category)
    {
        if (string.IsNullOrWhiteSpace(category)) return Enumerable.Empty<object>();

        var normalizedQuery = CodeAnalysisService.NormalizeCategory(category);
        var roots = await BuildCompositeForestAsync();
        var allMatches = new List<CodeReference>();

        foreach (var root in roots)
        {
            allMatches.AddRange(root.Flatten().Where(reference =>
                CodeAnalysisService.NormalizeCategory(reference.Category).Contains(normalizedQuery)
            ));
        }

        return allMatches.Select(match =>
            match is CodeReferenceComposite composite
                ? composite.ToCardWithChildren()
                : match.ToCardModel()
        );
    }

    public async Task<IEnumerable<object>> SearchByNameAsync(string name)
    {
        var matchingEntities = await _context.CodeReferences
            .Where(e => EF.Functions.Like(e.Name, $"%{name}%"))
            .ToListAsync();

        return matchingEntities.Select(e => e.ToCardModel());
    }

    public async Task<IEnumerable<object>> GetByLanguageAndCategoryAsync(string language, string category)
    {
        if (string.IsNullOrWhiteSpace(language) || string.IsNullOrWhiteSpace(category)) return Enumerable.Empty<object>();

        var normalizedLang = CodeAnalysisService.NormalizeCategory(language);
        var normalizedCategory = CodeAnalysisService.NormalizeCategory(category);

        var roots = await BuildCompositeForestAsync();
        var allMatches = new List<CodeReference>();

        foreach (var root in roots)
        {
            allMatches.AddRange(root.Flatten().Where(reference =>
                CodeAnalysisService.NormalizeCategory(reference.Language).Contains(normalizedLang) &&
                CodeAnalysisService.NormalizeCategory(reference.Category).Contains(normalizedCategory)
            ));
        }

        return allMatches.Select(match =>
            match is CodeReferenceComposite composite
                ? composite.ToCardWithChildren()
                : match.ToCardModel()
        );
    }

    public async Task<IEnumerable<object>> GetByLanguageAndNameAsync(string language, string name)
    {
        Console.WriteLine("language " + language);
        Console.WriteLine(name);
        var lowerName = name.ToLower();
        var lowerLanguage = language.ToLower();

        var matchingEntities = await _context.CodeReferences
            .Where(e => e.Language.ToLower() == lowerLanguage &&
                        lowerName.Contains(e.Name.ToLower()))
            .ToListAsync();

        return matchingEntities.Select(e => e.ToCardModel());
    }


    public async Task<IEnumerable<object>> RecommendSimilarAsync(string userCodeAttempt)
    {
        var userKeywords = userCodeAttempt.ExtractCodeConcepts();
        if (!userKeywords.Any()) return Enumerable.Empty<object>();

        var allEntities = await _context.CodeReferences.ToListAsync();
        var topMatches = allEntities.GetTopMatches(userKeywords);

        var results = new List<object>();
        foreach (var entity in topMatches)
        {
            var node = await BuildNodeAsync(entity, allEntities, useComposite: true); // Usando composite
            results.Add(node is CodeReferenceComposite composite
                ? composite.ToCardWithChildren()
                : node.ToCardModel());
        }

        return results;
    }

    public async Task<IEnumerable<object>> GetFlattenedReferencesAsync(string? language = null, string? category = null, string? name = null, int? maxDepth = null)
    {
        var roots = await BuildCompositeForestAsync();
        var flattened = roots.SelectMany(root => root.Flatten(category: category, name: name, maxDepth: maxDepth));

        return flattened.Select(reference =>
            reference is CodeReferenceComposite composite
                ? composite.ToCardWithChildren()
                : reference.ToCardModel()
        );
    }

    public async Task<int> GetReferencesDepthAsync(string? category = null, string? name = null)
    {
        var roots = await BuildCompositeForestAsync();
        return roots.Max(root => root.GetDepth(category, name));
    }
}
