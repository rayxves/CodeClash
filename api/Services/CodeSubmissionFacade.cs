using Models;
using Validators;
using Interfaces;
using Dtos;
using Builders;

namespace Services;

public class CodeSubmissionFacade
{
    private readonly ISubmissionHandler _handlerChain;
    private readonly IJudge0Interface _judge0Client;

    public CodeSubmissionFacade(IJudge0Interface judge0Client)
    {
        _judge0Client = judge0Client;
        _handlerChain = SubmissionHandlerChainFactory.CreateHandlerChain(_judge0Client);
    }

    public async Task<Judge0Response> SubmitCodeAsync(string sourceCode, string input, string languageName)
    {
        try
        {
            var language = Language.GetAll().FirstOrDefault(l =>
                    l.Name.Equals(languageName, StringComparison.OrdinalIgnoreCase) ||
                    l.Judge0Alias.Equals(languageName, StringComparison.OrdinalIgnoreCase)
                );

            if (language == null)
            {
                throw new NotSupportedException($"Language '{languageName}' is not supported.");
            }

            var request = new SubmissionRequest
            {
                Code = sourceCode,
                Input = input,
                Language = language.Name,
                LanguageId = language.Id
            };

            var context = new SubmissionContext { Request = request };
            await _handlerChain.HandleAsync(context);

            if (context.IsCompleted && !string.IsNullOrWhiteSpace(context.ErrorMessage))
            {
                throw new InvalidOperationException(context.ErrorMessage);
            }

            if (context.Response == null)
            {
                throw new Exception("An unknown error occurred while processing the submission.");
            }

            return context.Response;
        }
        catch (Exception ex)
        {
            throw new Exception($"Submission failed: {ex.Message}", ex);
        }
    }
}