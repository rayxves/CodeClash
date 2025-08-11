using Dtos;

namespace SubmissionChain.Handlers;

public class RuntimeErrorHandler : SubmissionHandler
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context)
    {
        return Task.FromResult(context.Response?.Status?.Id is >= 7 and <= 12);
    }
    
    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = context.Response?.Stderr ?? "Ocorreu um erro durante a execução.";
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}