namespace Iterators;

using Composites;

public class FilteredIterator : IIterator<CodeComponent>
{
    private readonly IIterator<CodeComponent> _innerIterator;
    private readonly Predicate<CodeComponent> _filter;
    private CodeComponent? _nextFiltered;

    public FilteredIterator(IIterator<CodeComponent> innerIterator, Predicate<CodeComponent> filter)
    {
        _innerIterator = innerIterator ?? throw new ArgumentNullException(nameof(innerIterator));
        _filter = filter ?? throw new ArgumentNullException(nameof(filter));
        FindNext();
    }

    private void FindNext()
    {
        _nextFiltered = null;
        while (_innerIterator.HasNext())
        {
            var candidate = _innerIterator.Next();
            if (_filter(candidate))
            {
                _nextFiltered = candidate;
                break;
            }
        }
    }

    public bool HasNext() => _nextFiltered != null;

    public CodeComponent Next()
    {
        if (_nextFiltered == null)
            throw new InvalidOperationException("Nenhum elemento a mais para filtrar");

        var current = _nextFiltered;
        FindNext();
        return current;
    }

    public void Reset()
    {
        _innerIterator.Reset();
        FindNext();
    }

    public CodeComponent? Current() => _nextFiltered;
}