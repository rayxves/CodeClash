using Dtos;
using Models;

namespace SubmissionChain.Handlers;

public class LanguageValidationHandler : SubmissionHandler
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response == null);

    protected override Task ProcessAsync(SubmissionContext context)
    {
         var isSupported = Language.GetAll().Any(lang => 
                lang.Name.Equals(context.Request.Language, StringComparison.OrdinalIgnoreCase) ||
                lang.Judge0Alias.Equals(context.Request.Language, StringComparison.OrdinalIgnoreCase)
            );


        if (!isSupported)
        {
            context.ErrorMessage = $"Linguagem '{context.Request.Language}' não é suportada.";
            context.IsCompleted = true;
        }

        return Task.CompletedTask;
    }
}