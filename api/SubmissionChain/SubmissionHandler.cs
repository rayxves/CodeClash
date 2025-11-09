using Dtos;

namespace SubmissionChain;

public abstract class SubmissionHandler : ISubmissionHandler
{
    private ISubmissionHandler? _next;

    public ISubmissionHandler SetNext(ISubmissionHandler next)
    {
        _next = next;
        return next;
    }

    public async Task HandleAsync(SubmissionContext context)
    {
        await PreProcessAsync(context);

        if (await CanHandleAsync(context))
        {
            await ProcessAsync(context);
        }

        await PostProcessAsync(context);

        if (!context.IsCompleted && _next is not null)
        {
            await _next.HandleAsync(context);
        }
    }

    protected virtual Task PreProcessAsync(SubmissionContext context)
    {
        return Task.CompletedTask;
    }

    protected abstract Task<bool> CanHandleAsync(SubmissionContext context);

    protected abstract Task ProcessAsync(SubmissionContext context);

    protected virtual Task PostProcessAsync(SubmissionContext context)
    {
        return Task.CompletedTask;
    }
}