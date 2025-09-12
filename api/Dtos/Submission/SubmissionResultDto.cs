
using Strategies.Enums;

namespace Dtos;

public class SubmissionResultDto
{
    public List<TestCaseResultDto> TestResults { get; set; } = new List<TestCaseResultDto>();
    public Judge0Response? SimpleExecutionResult { get; set; }
    public SubmissionStatus OverallStatus { get; set; }
    public string? Notification { get; set; }
    public int? PointsGained { get; set; }

}

