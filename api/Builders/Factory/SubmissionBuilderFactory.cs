using Models;

namespace Builders;

public static class SubmissionBuilderFactory
{
    public static ISubmissionBuilder CreateBuilder(string languageIdentifier)
    {
        try 
        {
            return SubmissionBuilderRegistry.GetBuilder(languageIdentifier);
        }
        catch (NotSupportedException ex)
        {
            throw new NotSupportedException($"Nenhum builder suportado para: {languageIdentifier}", ex);
        }
    }
    
    public static IReadOnlyCollection<Language> GetSupportedLanguages() 
        => SubmissionBuilderRegistry.GetSupportedLanguages();
}