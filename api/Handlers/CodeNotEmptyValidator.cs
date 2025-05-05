using Models;

namespace Validators;

public class CodeNotEmptyValidator : SubmissionHandlerBase
{
    protected override async Task<bool> CanHandleAsync(SubmissionContext context)
    {
        return context.Response == null;
    }

    protected override async Task ProcessAsync(SubmissionContext context)
    {
        if (string.IsNullOrWhiteSpace(context.Request.Code))
        {
            context.ErrorMessage = "O código não pode ser vazio.";
            context.IsCompleted = true;
        }
    }
}
