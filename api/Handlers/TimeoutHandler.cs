using Models;

namespace Validators;

public class TimeoutHandler : SubmissionHandlerBase
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response?.Status?.Id == 5);

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = SubmissionErrorMessages.Timeout;
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}
