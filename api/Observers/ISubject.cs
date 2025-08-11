using Dtos;

namespace Observers;

public interface ISubject
{
    void Attach(IObserver observer);
    void Detach(IObserver observer);
    Task NotifyAsync(SubmissionSuccessContext context);
}