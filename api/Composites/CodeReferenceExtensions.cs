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

    public static object ToCardModel(this CodeReference reference)
    {
        return new
        {
            reference.Name,
            reference.Description,
            Language = reference.Language.ToUpper(),
            reference.Code
        };
    }

    public static List<CodeReference> RecommendSimilar(this CodeReference reference, string userCodeAttempt)
    {
        var keywords = ExtractKeywords(userCodeAttempt);
        var results = new List<CodeReference>();

        if (keywords.Any(k =>
            reference.Description.Contains(k, StringComparison.OrdinalIgnoreCase) ||
            reference.Code.Contains(k, StringComparison.OrdinalIgnoreCase)))
        {
            results.Add(reference);
        }

        foreach (var child in reference.GetChildren())
        {
            results.AddRange(child.RecommendSimilar(userCodeAttempt));
        }

        return results.Distinct().Take(3).ToList();
    }

    private static List<string> ExtractKeywords(string code)
    {
        return code.Split(new[] { ' ', '\n', '\t', '(', ')', '{', '}' }, StringSplitOptions.RemoveEmptyEntries)
                   .Where(w => w.Length > 3)
                   .Distinct()
                   .ToList();
    }

    public static List<string> CompareWithUserCode(this CodeReference reference, string userCode)
    {
        var referenceLines = reference.Code.Split('\n');
        var userLines = userCode.Split('\n');
        var diffs = new List<string>();

        for (int i = 0; i < Math.Min(referenceLines.Length, userLines.Length); i++)
        {
            if (!referenceLines[i].Trim().Equals(userLines[i].Trim(), StringComparison.OrdinalIgnoreCase))
            {
                diffs.Add($"Linha {i + 1}: Esperado → {referenceLines[i].Trim()} | Seu código → {userLines[i].Trim()}");
            }
        }

        return diffs;
    }
}
