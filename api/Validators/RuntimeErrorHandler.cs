using Models;

namespace Validators;

public class RuntimeErrorHandler : SubmissionHandlerBase
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response?.Status?.Id is >= 7 and <= 12);

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = SubmissionErrorMessages.Runtime(context.Response?.Stderr ?? "Erro desconhecido");
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}
