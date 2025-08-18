using Dtos;
using Models;
using static Services.DbSeeder;

namespace Composites;

public class CodeAlgorithm : CodeComponent
{
    public string Code { get; }

    public CodeAlgorithm(CodeReferenceEntity entity)
    {
        Id = entity.Id;
        Name = entity.Name;
        Category = entity.Category;
        Language = entity.Language;
        Description = entity.Description;
        Code = entity.Code;
    }

    public CodeAlgorithm(CodeReferenceSeedDto dto)
    {
        Name = dto.Name;
        Category = dto.Category;
        Language = dto.Language;
        Description = dto.Description;
        Code = dto.Code;
    }

    public override bool IsComposite() => false;
    public override IEnumerable<CodeComponent> GetChildren() => Enumerable.Empty<CodeComponent>();
}