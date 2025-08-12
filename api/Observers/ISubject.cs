using Dtos;

namespace Observers;

public interface ISubject
{
    Task NotifyAsync(SubmissionSuccessContext context);
}