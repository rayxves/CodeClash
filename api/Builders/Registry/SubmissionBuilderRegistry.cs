using Builders;
using Models;
namespace Builders;

public static class SubmissionBuilderRegistry
{
    private static readonly Dictionary<string, ISubmissionBuilder> _builders;

    static SubmissionBuilderRegistry()
    {
        var builders = new ISubmissionBuilder[]
        {
            new PythonSubmissionBuilder(),
            new JavaSubmissionBuilder(),
            new CppSubmissionBuilder(),
            new CsharpSubmissionBuilder(),
            new JavaScriptSubmissionBuilder()
        };

        _builders = builders.ToDictionary(b => b.Language.Name.ToLowerInvariant());
    }

    public static ISubmissionBuilder GetBuilder(string languageName) =>
        _builders.TryGetValue(languageName.ToLowerInvariant(), out var builder)
            ? builder
            : throw new NotSupportedException($"Linguagem '{languageName}' não suportada");

    public static IReadOnlyCollection<Language> GetSupportedLanguages() =>
        _builders.Values.Select(b => b.Language).ToList().AsReadOnly();
}
