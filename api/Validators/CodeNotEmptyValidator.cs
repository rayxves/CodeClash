using Models;

namespace Validators;

public class CodeNotEmptyValidator : SubmissionHandlerBase
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(string.IsNullOrWhiteSpace(context.Request.Code));

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = SubmissionErrorMessages.CodeEmpty;
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}
