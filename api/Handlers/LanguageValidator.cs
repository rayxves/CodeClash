using Builders;
using Models;
namespace Validators;
public class LanguageValidator : SubmissionHandlerBase
{
    protected override async Task<bool> CanHandleAsync(SubmissionContext context)
    {
        return context.Response == null;
    }

    protected override async Task ProcessAsync(SubmissionContext context)
    {
        var builder = SubmissionBuilderRegistry.GetBuilderByName(context.Request.Language);
        if (builder == null)
        {
            context.ErrorMessage = $"Linguagem '{context.Request.Language}' não suportada.";
            context.IsCompleted = true;
        }
    }
}