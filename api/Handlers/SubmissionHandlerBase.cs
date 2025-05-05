using Models;

namespace Validators;

public abstract class SubmissionHandlerBase : ISubmissionHandler
{
    private ISubmissionHandler _next;

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

        if (_next != null && !context.IsCompleted)
        {
            await _next.HandleAsync(context);
        }
    }

    protected abstract Task<bool> CanHandleAsync(SubmissionContext context);
    protected abstract Task ProcessAsync(SubmissionContext context);
}