using Dtos;

namespace SubmissionChain.Handlers;

public class RuntimeErrorHandler : SubmissionHandler
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context)
    {
        if (context.Response?.Status?.Id is null)
        {
            return Task.FromResult(false);
        }

        var status = (Judge0Status)context.Response.Status.Id;

        bool isRuntimeError = status switch
        {
            Judge0Status.RuntimeErrorSigsegv => true,
            Judge0Status.RuntimeErrorSigfpe => true,
            Judge0Status.RuntimeErrorNzec => true,
            Judge0Status.RuntimeErrorAborted => true,
            _ => false
        };

        return Task.FromResult(isRuntimeError);
    }

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = context.Response?.Stderr ?? "Ocorreu um erro durante a execução.";
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}