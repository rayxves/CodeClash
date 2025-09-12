using Dtos;

namespace Observers;

public interface IObserver
{
    Task UpdateAsync(SubmissionSuccessContext context);
}