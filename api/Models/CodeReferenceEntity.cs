using System.ComponentModel.DataAnnotations;

namespace Models;

public class CodeReferenceEntity
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int? ParentId { get; set; }
    public CodeReferenceEntity? Parent { get; set; }
    public List<CodeReferenceEntity> Children { get; set; } = new();
}