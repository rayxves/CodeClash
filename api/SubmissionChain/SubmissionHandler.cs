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
        if (await CanHandleAsync(context))
        {
            await ProcessAsync(context);
        }

        if (!context.IsCompleted && _next is not null)
        {
            await _next.HandleAsync(context);
        }
    }

    protected abstract Task<bool> CanHandleAsync(SubmissionContext context);
    protected abstract Task ProcessAsync(SubmissionContext context);
}