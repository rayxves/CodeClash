using Models;

namespace Strategies
{
    public record SubmissionStrategyInput(
        string SourceCode,
        Language Language,
        string UserId,
        int? ProblemId = null
    );
}