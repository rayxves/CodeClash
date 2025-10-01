using Strategies.Enums;
using SubmissionChain;

namespace Services.Extensions;

public static class Judge0StatusExtensions
{
    public static SubmissionStatus ToSubmissionStatus(this Judge0Status judge0Status)
    {
        return judge0Status switch
        {
            Judge0Status.Accepted => SubmissionStatus.Completed,
            Judge0Status.WrongAnswer => SubmissionStatus.WrongAnswer,
            Judge0Status.CompilationError => SubmissionStatus.CompilationError,
            Judge0Status.TimeLimitExceeded => SubmissionStatus.TimeLimitExceeded,

            Judge0Status.RuntimeErrorSigsegv or
            Judge0Status.RuntimeErrorSigfpe or
            Judge0Status.RuntimeErrorAborted or
            Judge0Status.RuntimeErrorNzec
                => SubmissionStatus.RuntimeError,

            _ => SubmissionStatus.ServerError
        };
    }
}