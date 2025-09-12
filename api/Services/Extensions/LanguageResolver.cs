using Interfaces;
using Models;

namespace Services.Extensions;


public class LanguageResolver : ILanguageResolver
{
    public Language? Resolve(string languageName)
    {
        var lang = Language.GetAll().FirstOrDefault(l =>
       l.Name.Equals(languageName, StringComparison.OrdinalIgnoreCase) ||
       l.Judge0Alias.Equals(languageName, StringComparison.OrdinalIgnoreCase)
   );

        if (lang == null)
            throw new InvalidOperationException($"Linguagem '{languageName}' não é suportada.");

        return lang;
    }
}