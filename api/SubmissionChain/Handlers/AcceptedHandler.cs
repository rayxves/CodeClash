using Dtos;
using Models;

namespace SubmissionChain.Handlers;

public class AcceptedHandler : SubmissionHandler
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response?.Status?.Id == 3);

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}