using Dtos;

namespace SubmissionChain.Handlers;

public class ProcessingHandler : SubmissionHandler
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response?.Status?.Id is 1 or 2);

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = "Submissão ainda em processamento no Judge0.";
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}
