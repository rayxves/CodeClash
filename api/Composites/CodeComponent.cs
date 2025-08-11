namespace Composites;

public abstract class CodeComponent
{
    public int Id { get; protected set; } 
    public string Name { get; protected set; } = string.Empty;
    public string Category { get; protected set; } = string.Empty;
    public string Language { get; protected set; } = string.Empty;
    public string Description { get; protected set; } = string.Empty;

    public virtual void Add(CodeComponent component) => throw new NotSupportedException();
    public abstract bool IsComposite();
    public abstract IEnumerable<CodeComponent> GetChildren();
}
