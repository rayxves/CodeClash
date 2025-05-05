using Models;

namespace Composites;

public class CodeReferenceComposite : CodeReference
{
    private readonly List<CodeReference> _children = new();

    public IReadOnlyList<CodeReference> Children => _children.AsReadOnly();

    public void AddChild(CodeReference child)
    {
        _children.Add(child);
    }

    public bool HasChildren => _children.Any();

    public override IEnumerable<CodeReference> GetChildren() => _children;
}
