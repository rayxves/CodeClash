using Interfaces;

namespace Validators;

public static class SubmissionHandlerChainFactory
{
    public static ISubmissionHandler CreateHandlerChain(IJudge0Interface judge0Client)
    {
        var chain = new LanguageValidator();
        chain
            .SetNext(new CodeNotEmptyValidator())
            .SetNext(new SendToJudge0Handler(judge0Client))
            .SetNext(new CompilationErrorHandler())
            .SetNext(new TimeoutHandler())
            .SetNext(new RuntimeErrorHandler())
            .SetNext(new UnprocessableEntityHandler())
            .SetNext(new SuccessHandler());

        return chain;
    }
}