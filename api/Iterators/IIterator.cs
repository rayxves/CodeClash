namespace Iterators;

public interface IIterator<out T>
{
    bool HasNext();
    T Next();
    void Reset();
    T? Current();
}