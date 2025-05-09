using Composites;
using Models;

namespace Interfaces;

public interface ICodeReferenceInterface
{
    Task<IEnumerable<object>> GetByLanguageAsync(string language);
    Task<IEnumerable<object>> GetByCategoryAsync(string category);
    Task<IEnumerable<object>> SearchByNameAsync(string name);
    Task<IEnumerable<object>> RecommendSimilarAsync(string userCodeAttempt);
    Task<CodeReferenceComposite> BuildCompositeTreeAsync(int? rootId = null);
}