
namespace Dtos;

public class SubmissionResultDto
{
    public List<TestCaseResultDto>? TestResults { get; set; }
    public Judge0Response? SimpleExecutionResult { get; set; }
    public string? OverallStatus { get; set; }
    public string? CompilationError { get; set; }
}