using Composites;
using Dtos;
using Models;

namespace Interfaces;

public interface ICodeReferenceServices
{
    Task<CodeReferenceEntity> AddReferenceAsync(string name, string category, string language, string code, string description, int? parentId);
    Task<object> GetByIdAsync(int id);
    Task<IEnumerable<object>> SearchAsync(string? language = null, string? category = null, string? name = null);
    Task<List<CodeReferenceEntity>> GetAllDescendantsAsync(List<int> parentIds);
    Task<IEnumerable<object>> RecommendSimilarAsync(string userCodeAttempt, int take = 5);
    Task<CodeComponent?> BuildTreeForLanguageAsync(string language);
    Task<CategoryViewDto?> GetCategoryViewAsync(string language, string? categoryName = null);

}