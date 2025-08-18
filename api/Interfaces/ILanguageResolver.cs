using Models;

namespace Interfaces;

public interface ILanguageResolver
{
    Language? Resolve(string languageName);
}