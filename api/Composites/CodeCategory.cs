using Dtos;
using Models;
using static Services.DbSeeder;

namespace Composites;

public class CodeCategory : CodeComponent
{
    private readonly List<CodeComponent> _children = new();

    public CodeCategory(CodeReferenceEntity entity)
    {
        Id = entity.Id;
        Name = entity.Name;
        Category = entity.Category;
        Language = entity.Language;
        Description = entity.Description;
    }

    public CodeCategory(CodeReferenceSeedDto dto)
    {
        Name = dto.Name;
        Category = dto.Category;
        Language = dto.Language;
        Description = dto.Description;
    }

    public override void Add(CodeComponent component) => _children.Add(component);
    public override bool IsComposite() => true;
    public override IEnumerable<CodeComponent> GetChildren() => _children.AsReadOnly();
}