namespace Iterators;

using Composites;

public class BreadthFirstIterator : IIterator<CodeComponent>
{
    private readonly Queue<CodeComponent> _queue = new();
    private readonly CodeComponent _root;
    private CodeComponent? _current;

    public BreadthFirstIterator(CodeComponent root)
    {
        _root = root ?? throw new ArgumentNullException(nameof(root));
        Reset();
    }

    public bool HasNext() => _queue.Count > 0;

    public CodeComponent Next()
    {
        if (!HasNext())
            throw new InvalidOperationException("Nenhum elemento a mais pra iterar.");

        _current = _queue.Dequeue();
        
        foreach (var child in _current.GetChildren())
        {
            _queue.Enqueue(child);
        }

        return _current;
    }

    public void Reset()
    {
        _queue.Clear();
        _queue.Enqueue(_root);
        _current = null;
    }

    public CodeComponent? Current() => _current;
}
