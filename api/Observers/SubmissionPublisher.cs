using Dtos;
using Interfaces;

namespace Observers;

public class SubmissionPublisher : ISubject
{
    private readonly List<IObserver> _observers = new();

    public void Attach(IObserver observer)
    {
        _observers.Add(observer);
    }

    public void Detach(IObserver observer)
    {
        _observers.Remove(observer);
    }

    public async Task NotifyAsync(SubmissionSuccessContext context)
    {
        foreach (var observer in _observers)
        {
            await observer.UpdateAsync(context);
        }
    }

   
}