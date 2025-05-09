using Composites;
using Data;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Models;
using Services.Extensions;
namespace Services;

public class CodeReferenceService : ICodeReferenceInterface
{
    private readonly ApplicationDbContext _context;

    public CodeReferenceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CodeReferenceComposite> BuildCompositeTreeAsync(int? rootId = null)
    {
        var composite = new CodeReferenceComposite();

        var entities = await _context.CodeReferences
            .Where(r => rootId == null ? r.ParentId == null : r.Id == rootId || r.ParentId == rootId)
            .ToListAsync();

        foreach (var entity in entities.Where(e => e.ParentId == null || e.ParentId == rootId))
        {
            composite.AddChild(await BuildNodeAsync(entity, entities));
        }

        return composite;
    }

    private async Task<CodeReference> BuildNodeAsync(CodeReferenceEntity entity, List<CodeReferenceEntity> loadedEntities)
    {
        if (!entity.Children.Any() && loadedEntities.Any(e => e.ParentId == entity.Id))
        {
            var node = new CodeReferenceComposite
            {
                Name = entity.Name,
                Category = entity.Category,
                Language = entity.Language,
                Code = entity.Code,
                Description = entity.Description
            };

            foreach (var child in loadedEntities.Where(e => e.ParentId == entity.Id))
            {
                node.AddChild(await BuildNodeAsync(child, loadedEntities));
            }

            return node;
        }
        else if (entity.Children.Any())
        {
            var node = new CodeReferenceComposite
            {
                Name = entity.Name,
                Category = entity.Category,
                Language = entity.Language,
                Code = entity.Code,
                Description = entity.Description
            };

            foreach (var child in entity.Children)
            {
                node.AddChild(await BuildNodeAsync(child, loadedEntities));
            }

            return node;
        }
        else
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
    }

    public async Task<IEnumerable<object>> GetByLanguageAsync(string language)
    {
        var root = await BuildCompositeTreeAsync();
        var matches = root.FindByLanguage(language);

        var results = new List<object>();
        foreach (var match in matches)
        {
            if (match is CodeReferenceComposite composite)
            {
                results.Add(composite.ToCardWithChildren());
            }
            else
            {
                var entity = await _context.CodeReferences
                    .Include(e => e.Parent)
                    .FirstOrDefaultAsync(e => e.Name == match.Name && e.Category == match.Category);

                if (entity != null)
                {
                    var rootId = entity.ParentId ?? entity.Id;
                    var tree = await BuildCompositeTreeAsync(rootId);

                    var foundNode = tree.FindNode(match.Name);
                    if (foundNode is CodeReferenceComposite foundComposite)
                    {
                        results.Add(foundComposite.ToCardWithChildren());
                    }
                    else if (foundNode != null)
                    {
                        results.Add(foundNode.ToCardModel());
                    }
                }
            }
        }
        return results;

    }

    public async Task<IEnumerable<object>> GetByCategoryAsync(string category)
    {
        var root = await BuildCompositeTreeAsync();
        var matches = root.FilterByCategory(category);

        var results = new List<object>();
        foreach (var match in matches)
        {
            if (match is CodeReferenceComposite composite)
            {
                results.Add(composite.ToCardWithChildren());
            }
            else
            {
                var entity = await _context.CodeReferences
                    .Include(e => e.Parent)
                    .FirstOrDefaultAsync(e => e.Name == match.Name && e.Category == match.Category);

                if (entity != null)
                {
                    var rootId = entity.ParentId ?? entity.Id;
                    var tree = await BuildCompositeTreeAsync(rootId);

                    var foundNode = tree.FindNode(match.Name);
                    if (foundNode is CodeReferenceComposite foundComposite)
                    {
                        results.Add(foundComposite.ToCardWithChildren());
                    }
                    else if (foundNode != null)
                    {
                        results.Add(foundNode.ToCardModel());
                    }
                }
            }
        }

        return results;
    }
    public async Task<IEnumerable<object>> SearchByNameAsync(string name)
    {
        var matchingEntities = await _context.CodeReferences
            .Where(e => EF.Functions.Like(e.Name, $"%{name}%"))
            .Include(e => e.Parent)
            .ToListAsync();

        var results = new List<object>();

        foreach (var entity in matchingEntities)
        {
            if (entity.ParentId == null)
            {
                var tree = await BuildCompositeTreeAsync(entity.Id);
                if (tree.Children.FirstOrDefault() is CodeReferenceComposite rootComposite)
                {
                    results.Add(rootComposite.ToCardWithChildren());
                }
            }
            else
            {
                var parent = await _context.CodeReferences
                    .Include(p => p.Children)
                    .FirstOrDefaultAsync(p => p.Id == entity.ParentId);

                if (parent != null)
                {
                    var parentNode = await BuildNodeAsync(parent, new List<CodeReferenceEntity> { parent });
                    if (parentNode is CodeReferenceComposite parentComposite)
                    {
                        var foundChild = parentComposite.GetChildren()
                            .FirstOrDefault(c => c.Name.Equals(entity.Name, StringComparison.OrdinalIgnoreCase));

                        if (foundChild != null)
                        {
                            results.Add(foundChild.ToCardModel());
                        }
                    }
                }
            }
        }

        return results;
    }

    public async Task<IEnumerable<object>> RecommendSimilarAsync(string userCodeAttempt)
    {
        var userKeywords = userCodeAttempt.ExtractCodeConcepts();

        if (!userKeywords.Any())
            return Enumerable.Empty<object>();

        var allEntities = await _context.CodeReferences
            .Include(e => e.Parent)
            .ToListAsync();

        var topMatches = allEntities.GetTopMatches(userKeywords);

        var results = new List<object>();

        foreach (var entity in topMatches)
        {
            if (entity.ParentId == null)
            {
                var tree = await BuildCompositeTreeAsync(entity.Id);
                if (tree.Children.FirstOrDefault() is CodeReferenceComposite rootComposite)
                {
                    results.Add(rootComposite.ToCardWithChildren());
                }
            }
            else
            {
                results.Add(new CodeReference
                {
                    Name = entity.Name,
                    Category = entity.Category,
                    Language = entity.Language,
                    Code = entity.Code,
                    Description = entity.Description
                }.ToCardModel());
            }
        }

        return results;
    }

}