namespace Dtos;

public class CodeReferenceDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Category { get; set; }
    public string Language { get; set; }
    public string? Code { get; set; }
    public string Description { get; set; }
    public int? ParentId { get; set; }
    public List<CodeReferenceDto> Children { get; set; } = new();

}