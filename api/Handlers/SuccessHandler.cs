using Models;

namespace Validators;

public class SuccessHandler : SubmissionHandlerBase
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response?.Status?.Id == 3);

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}
