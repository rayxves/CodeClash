using Dtos;

namespace SubmissionChain.Handlers;

public class CodeNotEmptyValidationHandler : SubmissionHandler
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(string.IsNullOrWhiteSpace(context.Request.Code));

    protected override Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = "O código fonte não pode estar vazio.";
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}