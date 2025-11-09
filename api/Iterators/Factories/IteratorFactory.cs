using Composites;

namespace Iterators;

public class IteratorFactory : IIteratorFactory
{
    public IIterator<CodeComponent> CreateIterator(CodeComponent root, string mode)
    {
        return mode.ToLower() switch
        {
            "breadth" => new BreadthFirstIterator(root),
            "depth" => new DepthFirstIterator(root),
            "algorithms" => new AlgorithmsOnlyIterator(root),
            _ => new DepthFirstIterator(root)
        };
    }
}