using Models;

namespace Interfaces;

public interface ICodeExecutionInterface
{
    Task<SubmissionResult> ExecuteAsync(string language, string code, string input = null);
    IEnumerable<CodeReference> GetRecommendedExamples(string language, string userCode);
}