using Iterators;

namespace Composites;

public abstract class CodeComponent : IAggregate<CodeComponent>
{
    public int Id { get; protected set; }
    public string Name { get; protected set; } = string.Empty;
    public string Category { get; protected set; } = string.Empty;
    public string Language { get; protected set; } = string.Empty;
    public string Description { get; protected set; } = string.Empty;
    public abstract bool IsComposite();
    public virtual void Add(CodeComponent component) => throw new NotSupportedException();
    public abstract IEnumerable<CodeComponent> GetChildren();
    public IEnumerable<CodeComponent> Children => GetChildren();

    public IIterator<CodeComponent> CreateIterator(string mode)
    {
        return mode.ToLower() switch
        {
            "breadth" => new BreadthFirstIterator(this),
            "depth" => new DepthFirstIterator(this),
            "algorithms" => new AlgorithmsOnlyIterator(this),
            _ => new DepthFirstIterator(this)
        };
    }

    }
