using Models;

namespace Validators;

public class UnprocessableEntityHandler : SubmissionHandlerBase
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context)
        => Task.FromResult(context.Response?.Status?.Id == 13); 

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = "Requisição inválida ou linguagem não suportada.";
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}
