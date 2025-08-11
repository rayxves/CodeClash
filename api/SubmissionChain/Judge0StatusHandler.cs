using Dtos;

namespace SubmissionChain;

public abstract class Judge0StatusHandler : SubmissionHandler
{
    protected abstract int HandledStatusId { get; }

    protected override Task<bool> CanHandleAsync(SubmissionContext context)
    {
        return Task.FromResult(context.Response?.Status?.Id == HandledStatusId);
    }

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = GetErrorMessage(context);
        context.IsCompleted = true;
        return Task.CompletedTask;
    }

    protected abstract string GetErrorMessage(SubmissionContext context);
}