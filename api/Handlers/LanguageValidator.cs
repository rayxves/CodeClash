using Builders;
using Models;

namespace Validators;

public class LanguageValidator : SubmissionHandlerBase
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response == null); 

    protected override Task ProcessAsync(SubmissionContext context)
    {
        try
        {
            _ = SubmissionBuilderRegistry.GetBuilder(context.Request.Language);
        }
        catch (NotSupportedException ex)
        {
            context.ErrorMessage = ex.Message;
            context.IsCompleted = true;
        }
        return Task.CompletedTask;
    }
}
