using Models;

namespace Interfaces;

public interface ICodeReferenceRepository
{
    Task<CodeReferenceEntity?> GetByIdAsync(int id);
    Task<List<CodeReferenceEntity>> GetAllAsync();
    Task<List<CodeReferenceEntity>> GetByLanguageAsync(string language);
    Task<List<CodeReferenceEntity>> SearchAsync(string? language, string? category, string? name);
    Task<List<CodeReferenceEntity>> GetAllDescendantsAsync(List<int> parentIds);
    Task<CodeReferenceEntity> AddAsync(CodeReferenceEntity entity);
    Task AddRangeAsync(IEnumerable<CodeReferenceEntity> entities);
    Task<int> SaveChangesAsync();
}