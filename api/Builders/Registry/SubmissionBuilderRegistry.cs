using Builders;
using Models;
namespace Builders;

public static class SubmissionBuilderRegistry
{
    private static readonly Dictionary<string, ISubmissionBuilder> _buildersByName;
    private static readonly Dictionary<string, ISubmissionBuilder> _buildersByAlias;

    static SubmissionBuilderRegistry()
    {
        var builders = new ISubmissionBuilder[]
        {
            new PythonSubmissionBuilder(),
            new JavaSubmissionBuilder(),
            new CppSubmissionBuilder(),
            new CsharpSubmissionBuilder(),
        };

        _buildersByName = builders.ToDictionary(b => b.Language.Name.ToLowerInvariant());
        _buildersByAlias = builders.ToDictionary(b => b.Language.Judge0Alias.ToLowerInvariant());
    }

    public static ISubmissionBuilder GetBuilder(string languageIdentifier) =>
        _buildersByName.TryGetValue(languageIdentifier.ToLowerInvariant(), out var builderByName)
            ? builderByName
            : _buildersByAlias.TryGetValue(languageIdentifier.ToLowerInvariant(), out var builderByAlias)
                ? builderByAlias
                : throw new NotSupportedException($"Linguagem '{languageIdentifier}' não suportada");

    public static IReadOnlyCollection<Language> GetSupportedLanguages() =>
        _buildersByName.Values.Select(b => b.Language).ToList().AsReadOnly();
}
