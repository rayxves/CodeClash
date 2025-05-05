using Builders;
using Models;
namespace Builders;
public static class SubmissionBuilderRegistry
{
    private static readonly Dictionary<int, ISubmissionBuilder> _buildersById;
    private static readonly Dictionary<string, ISubmissionBuilder> _buildersByName;

    static SubmissionBuilderRegistry()
    {
        var builders = new ISubmissionBuilder[]
        {
            new PythonSubmissionBuilder(),
            new JavaSubmissionBuilder(),
            new CppSubmissionBuilder(),
            new CSharpSubmissionBuilder(),
            new JavaScriptSubmissionBuilder()
        };

        _buildersById = builders.ToDictionary(b => b.Language.Id);
        _buildersByName = builders.ToDictionary(
            b => b.Language.Name, 
            StringComparer.OrdinalIgnoreCase);  
    }

    public static ISubmissionBuilder GetBuilderById(int languageId)
        => _buildersById.TryGetValue(languageId, out var builder) 
            ? builder 
            : throw new NotSupportedException($"ID {languageId} não suportado");

    public static ISubmissionBuilder GetBuilderByName(string languageName)
        => _buildersByName.TryGetValue(languageName, out var builder) 
            ? builder 
            : throw new NotSupportedException($"Linguagem '{languageName}' não suportada");

    public static IReadOnlyCollection<Language> GetSupportedLanguages()
        => _buildersById.Values.Select(b => b.Language).ToList().AsReadOnly();
}