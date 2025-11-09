using Composites;

namespace Iterators;

public interface IIteratorFactory
{
    IIterator<CodeComponent> CreateIterator(CodeComponent root, string mode);
}

