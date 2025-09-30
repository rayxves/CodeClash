namespace Dtos;

public class CodeComponentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Code { get; set; }
    public List<CodeComponentDto> Children { get; set; } = new();
}