using Composites;
using Models;

namespace Interfaces;

public interface ICodeReferenceInterface
{
    Task<IEnumerable<object>> GetByLanguageAsync(string language);
    Task<IEnumerable<object>> GetByCategoryAsync(string category);
    Task<IEnumerable<object>> SearchByNameAsync(string name);
    Task<IEnumerable<object>> RecommendSimilarAsync(string userCodeAttempt);
    Task<IEnumerable<object>> GetByLanguageAndCategoryAsync(string language, string category);
    Task<IEnumerable<object>> GetByLanguageAndNameAsync(string language, string name);
    Task<IEnumerable<object>> GetFlattenedReferencesAsync(string? language = null, string? category = null, string? name = null, int? maxDepth = null);
    Task<int> GetReferencesDepthAsync(string? category = null, string? name = null);
    Task<CodeReference> BuildCompositeTreeAsync(int? rootId = null);
    Task<List<CodeReference>> BuildCompositeForestAsync();
}
