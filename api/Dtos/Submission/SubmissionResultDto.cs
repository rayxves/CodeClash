
namespace Dtos;

public class SubmissionResultDto
{
    public List<TestCaseResultDto> TestResults { get; set; } = new List<TestCaseResultDto>();
    public Judge0Response? SimpleExecutionResult { get; set; } 
    public string? OverallStatus { get; set; }
    public string? CompilationError { get; set; }
    public string? Notification { get; set; }
    public int? PointsGained { get; set; }
}

