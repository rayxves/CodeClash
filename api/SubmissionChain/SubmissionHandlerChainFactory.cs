using Interfaces;
using SubmissionChain.Handlers;

namespace SubmissionChain;

public static class SubmissionChainFactory
{
    public static ISubmissionHandler Create(IJudge0Services judge0Service)
    {
        var chain = new CodeNotEmptyValidationHandler();

        chain
            .SetNext(new SendToJudge0Handler(judge0Service))
            .SetNext(new ProcessingHandler())
            .SetNext(new AcceptedHandler())
            .SetNext(new WrongAnswerHandler())         
            .SetNext(new CompilationErrorHandler())
            .SetNext(new TimeoutHandler())
            .SetNext(new MemoryLimitExceededHandler())  
            .SetNext(new RuntimeErrorHandler())
            .SetNext(new UnprocessableEntityHandler());

        return chain;
    }
}