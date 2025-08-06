using Builders;
using Models;

namespace Validators;

public class LanguageValidator : SubmissionHandlerBase
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
            context.ErrorMessage = $"Language '{context.Request.Language}' is not supported.";
            context.IsCompleted = true;
        }

        return Task.CompletedTask;
    }
}
