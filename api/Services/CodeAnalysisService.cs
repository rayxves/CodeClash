using System.Text.RegularExpressions;
using Models;

namespace Services.Extensions;

public static class CodeAnalysisService
{
    public static HashSet<string> ExtractCodeConcepts(this string code)
    {
        var withoutComments = Regex.Replace(code, @"//.*?$|/\*.*?\*/", "", RegexOptions.Multiline);

        var tokens = Regex.Split(withoutComments, @"\W+")
            .Where(t => t.Length > 2 && !t.IsCommonKeyword())
            .Select(t => t.ToLower())
            .Distinct();

        var patterns = new List<string>();
        if (Regex.IsMatch(code, @"\bfor\b.*?\bwhile\b", RegexOptions.IgnoreCase))
            patterns.Add("loop-nested");
        if (Regex.IsMatch(code, @"\bfunction\b|\bdef\b|\bfunc\b", RegexOptions.IgnoreCase))
            patterns.Add("function-def");

        return new HashSet<string>(tokens.Concat(patterns));
    }

    public static bool IsCommonKeyword(this string token)
    {
        var commonKeywords = new HashSet<string> {
            "var", "let", "const", "if", "else", "for", "while",
            "function", "return", "class", "void", "public", "private"
        };
        return commonKeywords.Contains(token.ToLower());
    }

    public static int CalculateMatchScore(this CodeReferenceEntity entity, HashSet<string> keywords)
    {
        int score = 0;

        score += keywords.Count(k => entity.Name.Contains(k, StringComparison.OrdinalIgnoreCase)) * 2;
        score += keywords.Count(k => entity.Description.Contains(k, StringComparison.OrdinalIgnoreCase));
        score += keywords.Count(k => entity.Code.Contains(k, StringComparison.OrdinalIgnoreCase)) * 3;

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