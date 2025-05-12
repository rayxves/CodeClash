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
        _handlerChain = BuildHandlerChain();
    }

    private ISubmissionHandler BuildHandlerChain()
    {
        var chain = new LanguageValidator();
        chain
            .SetNext(new CodeNotEmptyValidator())
            .SetNext(new SendToJudge0Handler(_judge0Client))
            .SetNext(new CompilationErrorHandler())
            .SetNext(new TimeoutHandler())
            .SetNext(new RuntimeErrorHandler())
            .SetNext(new UnprocessableEntityHandler())
            .SetNext(new SuccessHandler());

        return chain;
    }


    public async Task<Judge0Response> SubmitCodeAsync(string sourceCode, string input, string languageName)
    {

        try
        {
            var builder = SubmissionBuilderRegistry.GetBuilder(languageName);
            var request = builder.Build(sourceCode, input);

            var context = new SubmissionContext { Request = request };
            await _handlerChain.HandleAsync(context);

            if (!string.IsNullOrWhiteSpace(context.ErrorMessage))
                throw new Exception(context.ErrorMessage);

            return context.Response ?? throw new Exception("Erro desconhecido ao processar a submissão.");
        }
        catch (Exception ex)
        {
            throw new Exception($"{ex.Message}", ex);
        }
    }

}