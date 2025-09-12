using Dtos;
using Models;

namespace SubmissionChain;

public interface ISubmissionHandler
{
    ISubmissionHandler SetNext(ISubmissionHandler next);
    Task HandleAsync(SubmissionContext context);
}
