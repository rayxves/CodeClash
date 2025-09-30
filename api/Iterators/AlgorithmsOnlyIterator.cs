namespace Iterators;

using Composites;

public class AlgorithmsOnlyIterator : IIterator<CodeComponent>
{
    private readonly FilteredIterator _filteredIterator;

    public AlgorithmsOnlyIterator(CodeComponent root)
    {
        var baseIterator = new DepthFirstIterator(root);
        _filteredIterator = new FilteredIterator(
            baseIterator,
            component => !component.IsComposite() 
        );
    }

    public bool HasNext() => _filteredIterator.HasNext();
    public CodeComponent Next() => _filteredIterator.Next();
    public void Reset() => _filteredIterator.Reset();
    public CodeComponent? Current() => _filteredIterator.Current();
}
