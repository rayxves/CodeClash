using Models;

namespace Validators;

public interface ISubmissionHandler
{
    ISubmissionHandler SetNext(ISubmissionHandler next);
    Task HandleAsync(SubmissionContext context);
}
