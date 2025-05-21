using Models;

namespace Composites;

public class CodeReferenceComposite : CodeReference
{
    private readonly List<CodeReference> _children;

    public CodeReferenceComposite(IEnumerable<CodeReference>? children = null)
    {
        _children = children?.ToList() ?? new List<CodeReference>();
    }

    public IReadOnlyList<CodeReference> Children => _children.AsReadOnly();

    public void AddChild(CodeReference child) => _children.Add(child);

    public override IEnumerable<CodeReference> GetChildren() => _children;
}
