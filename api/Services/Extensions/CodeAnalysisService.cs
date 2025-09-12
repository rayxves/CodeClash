using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services.Extensions;

public static class CodeAnalysisService
{
    public static HashSet<string> ExtractCodeConcepts(this string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            return new HashSet<string>();

        var withoutComments = Regex.Replace(code, @"//.*?$|/\*.*?\*/", "", RegexOptions.Multiline);
        var withoutStrings = Regex.Replace(withoutComments, @"""[^""\\]*(?:\\.[^""\\]*)*""", "");
        withoutStrings = Regex.Replace(withoutStrings, @"'[^'\\]*(?:\\.[^'\\]*)*'", "");
        var withoutNumbers = Regex.Replace(withoutStrings, @"\b\d+\b", " ");
        var rawTokens = Regex.Split(withoutNumbers, @"\W+");

        var tokens = rawTokens
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Select(t => t.ToLowerInvariant())
            .Where(t => !t.IsCommonKeyword())
            .Distinct();

        var patterns = new List<string>();
        if (Regex.IsMatch(code, @"\bfor\b.*?\bwhile\b", RegexOptions.IgnoreCase))
            patterns.Add("loop-nested");
        if (Regex.IsMatch(code, @"\bfunction\b|\bdef\b|\bfunc\b", RegexOptions.IgnoreCase))
            patterns.Add("function-def");
        if (Regex.IsMatch(code, @"\bclass\b", RegexOptions.IgnoreCase))
            patterns.Add("class-def");
        if (Regex.IsMatch(code, @"\bimport\b|\busing\b|\brequire\b", RegexOptions.IgnoreCase))
            patterns.Add("import");

        return new HashSet<string>(tokens.Concat(patterns));
    }

    public static bool IsCommonKeyword(this string token)
    {
        var commonKeywords = new HashSet<string> {
            "int", "char", "float", "double", "return", "void",
            "static", "new", "delete", "const", "sizeof",
            "var", "public", "private", "protected", "internal",
            "class", "struct", "namespace", "using", "get", "set",
            "package", "import", "extends", "implements", "throws",
            "let", "const", "function", "export", "default", "async", "await",
            "def", "self", "elif", "from", "as", "with", "none", "true", "false"
        };
        return commonKeywords.Contains(token);
    }

    public static int CalculateMatchScore(this CodeReferenceEntity entity, HashSet<string> keywords)
    {
        int score = 0;
        score += keywords.Count(k => entity.Name.Contains(k, StringComparison.OrdinalIgnoreCase)) * 2;
        score += keywords.Count(k => entity.Description.Contains(k, StringComparison.OrdinalIgnoreCase));
        score += keywords.Count(k => entity.Code.Contains(k, StringComparison.OrdinalIgnoreCase)) * 3;
        score += keywords.Count(k => entity.Category.Contains(k, StringComparison.OrdinalIgnoreCase)) * 2;
        if (keywords.Any(k => string.Equals(k, entity.Language, StringComparison.OrdinalIgnoreCase)))
            score += 5;
        return score;
    }

    public static List<CodeReferenceEntity> GetTopMatches(
        this IEnumerable<CodeReferenceEntity> entities,
        HashSet<string> keywords,
        int topCount = 5)
    {
        return entities
            .Select(e => new { Entity = e, Score = e.CalculateMatchScore(keywords) })
            .Where(x => x.Score > 0)
            .OrderByDescending(x => x.Score)
            .Take(topCount)
            .Select(x => x.Entity)
            .ToList();
    }

    public static string NormalizeCategory(string input)
    {
        return input
            .ToLower()
            .Replace("_", "")
            .Replace("-", "")
            .Replace(" ", "");
    }
}
