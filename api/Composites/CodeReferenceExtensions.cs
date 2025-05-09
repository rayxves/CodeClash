using System.Text.RegularExpressions;
using Models;

namespace Composites;

public static class CodeReferenceExtensions
{
    public static List<CodeReference> FindByLanguage(this CodeReference reference, string language)
    {
        var results = new List<CodeReference>();

        if (reference.Language.Equals(language, StringComparison.OrdinalIgnoreCase))
        {
            results.Add(reference);
        }

        foreach (var child in reference.GetChildren())
        {
            results.AddRange(child.FindByLanguage(language));
        }

        return results;
    }

    public static List<CodeReference> FilterByCategory(this CodeReference reference, string category)
    {
        var results = new List<CodeReference>();

        if (reference.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
        {
            results.Add(reference);
        }

        foreach (var child in reference.GetChildren())
        {
            results.AddRange(child.FilterByCategory(category));
        }

        return results;
    }

    
    public static CodeReference FindNode(this CodeReference reference, string name)
    {
        if (reference.Name.Equals(name, StringComparison.OrdinalIgnoreCase))
        {
            return reference;
        }

        foreach (var child in reference.GetChildren())
        {
            var found = child.FindNode(name);
            if (found != null)
            {
                return found;
            }
        }

        return null;
    }


    public static object ToCardModel(this CodeReferenceEntity reference)
    {
        return new
        {
            reference.Id,
            reference.Name,
            reference.Category,
            reference.Language,
            reference.Code,
            reference.Description
        };
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
            Children = composite.Children.Select(c => c.ToCardModel())
        };
    }
}


