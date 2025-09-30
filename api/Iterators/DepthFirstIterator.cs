namespace Iterators;

using Composites;


public class DepthFirstIterator : IIterator<CodeComponent>
{
    private readonly Stack<CodeComponent> _stack = new();
    private readonly CodeComponent _root;
    private CodeComponent? _current;

    public DepthFirstIterator(CodeComponent root)
    {
        _root = root ?? throw new ArgumentNullException(nameof(root));
        Reset();
    }

    public bool HasNext() => _stack.Count > 0;

    public CodeComponent Next()
    {
        if (!HasNext())
            throw new InvalidOperationException("Nenhum elemento a mais pra iterar.");

        _current = _stack.Pop();
        
        var children = _current.GetChildren().Reverse().ToList();
        foreach (var child in children)
        {
            _stack.Push(child);
        }

        return _current;
    }

    public void Reset()
    {
        _stack.Clear();
        _stack.Push(_root);
        _current = null;
    }

    public CodeComponent? Current() => _current;
}