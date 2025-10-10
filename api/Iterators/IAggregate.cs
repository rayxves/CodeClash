namespace Iterators;

public interface IAggregate<out T>
{
    IIterator<T> CreateIterator(string mode);
}
