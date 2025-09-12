using Dtos;

namespace SubmissionChain.Handlers;

public class ProcessingHandler : SubmissionHandler
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context)
    {
        if (context.Response?.Status?.Id is null)
        {
            return Task.FromResult(false);
        }

        var status = (Judge0Status)context.Response.Status.Id;

        bool canHandle = status is Judge0Status.InQueue or Judge0Status.Processing;
        
        return Task.FromResult(canHandle);
    }

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = "Submissão ainda em processamento no Judge0.";
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}
