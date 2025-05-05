using Models;

namespace Validators;
public class CompilationErrorHandler : SubmissionHandlerBase
{
    protected override async Task<bool> CanHandleAsync(SubmissionContext context)
    {
        return context.Response?.Status?.Id == 6; 
    }

    protected override async Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = $"Erro de compilação: {context.Response.CompileOutput}";
        context.IsCompleted = true;
    }
}