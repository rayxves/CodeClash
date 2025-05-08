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
            .SetNext(new SuccessHandler());

        return chain;
    }

    public async Task<SubmissionResult> ProcessSubmissionAsync(SubmissionRequest request)
    {
        var context = new SubmissionContext { Request = request };

        await _handlerChain.HandleAsync(context);

        return new SubmissionResult
        {
            Status = context.ErrorMessage != null ? "Error" : "Success",
            Output = context.ErrorMessage
          ?? (!string.IsNullOrWhiteSpace(context.Response?.Stdout)
              ? context.Response.Stdout
              : "Nenhuma saída gerada pelo programa."),
            ExecutionTime = double.TryParse(context.Response?.Time, out var time) ? time : 0
        };


    }

    public async Task<Judge0Response> SubmitCodeAsync(string sourceCode, string input, string languageName)
    {
        try
        {
            var builder = SubmissionBuilderRegistry.GetBuilder(languageName);
            var request = builder.Build(sourceCode, input);

            var context = new SubmissionContext { Request = request };
            await _handlerChain.HandleAsync(context);

            if (context.Response != null)
                return context.Response;

            throw new Exception(context.ErrorMessage);
        }
        catch (Exception ex)
        {
            throw new Exception($"Erro na submissão: {ex.Message}", ex);
        }
    }

}