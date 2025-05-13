using System.Text.RegularExpressions;
using Models;

namespace Composites;

public static class CodeReferenceExtensions
{
    public static IEnumerable<CodeReference> GetChildren(this CodeReference reference)
    {
        if (reference is CodeReferenceComposite composite)
            return composite.Children;

        return Enumerable.Empty<CodeReference>();
    }

    public static List<CodeReference> FilterByCategory(this CodeReference reference, string category)
    {
        var results = new List<CodeReference>();

        if (reference.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
            results.Add(reference);

        foreach (var child in reference.GetChildren())
            results.AddRange(child.FilterByCategory(category));

        return results;
    }

    public static CodeReference? FindNode(this CodeReference reference, string name)
    {
        if (reference.Name.Equals(name, StringComparison.OrdinalIgnoreCase))
            return reference;

        foreach (var child in reference.GetChildren())
        {
            var found = child.FindNode(name);
            if (found != null)
                return found;
        }

        return null;
    }

    public static object ToCardModel(this CodeReference reference)
    {
        return new
        {
            reference.Name,
            reference.Category,
            reference.Language,
            reference.Code,
            reference.Description
        };
    }

    public static object ToCardWithChildren(this CodeReferenceComposite composite)
    {
        return new
        {
            composite.Name,
            composite.Category,
            composite.Language,
            composite.Code,
            composite.Description,
            Children = composite.Children.Select(c =>
                c is CodeReferenceComposite childComposite
                    ? childComposite.ToCardWithChildren()
                    : c.ToCardModel()
            )
        };
    }

    public static int GetDepth(this CodeReference reference, string? category = null, string? name = null)
    {
        if ((category == null || reference.Category?.Trim().Equals(category.Trim(), StringComparison.OrdinalIgnoreCase) == true) &&
        (name == null || reference.Name?.ToLower().Contains(name.ToLower()) == true))
        {
            return reference.GetChildren().Any()
                ? 1 + reference.GetChildren().Max(child => child.GetDepth(category, name))
                : 1;
        }

        return 0;
    }

    public static IEnumerable<CodeReference> Flatten(this CodeReference reference, string? category = null, string? name = null, int? maxDepth = null, int currentDepth = 0)
    {
        if (maxDepth.HasValue && currentDepth > maxDepth.Value)
            yield break;

        if ((category == null || reference.Category?.Trim().Equals(category.Trim(), StringComparison.OrdinalIgnoreCase) == true) &&
            (name == null || reference.Name?.ToLower().Contains(name.ToLower()) == true))
        {
            yield return reference;
        }

        foreach (var child in reference.GetChildren())
        {
            foreach (var subChild in child.Flatten(category, name, maxDepth, currentDepth + 1))
            {
                yield return subChild;
            }
        }
    }
}
