using Models;

namespace Dtos
{
    public record SubmissionStrategyInput(
        string SourceCode,
        Language Language,
        string UserId,
        int? ProblemId = null
    );
}