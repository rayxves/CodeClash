namespace Models;

public class CodeReference
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public virtual IEnumerable<CodeReference> GetChildren() => Enumerable.Empty<CodeReference>();
}
