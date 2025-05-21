using Models;

namespace Validators;

public class CompilationErrorHandler : SubmissionHandlerBase
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response?.Status?.Id == 6);

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = SubmissionErrorMessages.Compilation(context.Response?.CompileOutput ?? "Erro desconhecido");
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}
