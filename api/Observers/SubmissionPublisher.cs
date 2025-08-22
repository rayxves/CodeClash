using Dtos;

namespace Observers;
// Observers/SubmissionPublisher.cs
public class SubmissionPublisher : ISubject
{
    // Injete a lista de observers diretamente!
    private readonly IEnumerable<IObserver> _observers;

    public SubmissionPublisher(IEnumerable<IObserver> observers)
    {
        _observers = observers;
    }

    public async Task NotifyAsync(SubmissionSuccessContext context)
    {
        foreach (var observer in _observers)
        {
            await observer.UpdateAsync(context);
        }
    }
}