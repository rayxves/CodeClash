namespace Dtos;

public class TestCaseResultDto
{
    public int TestCaseId { get; set; }
    public bool Passed { get; set; }
    public string Status { get; set; }
    public string ExpectedOutput { get; set; }
    public string Output { get; set; }
    public string Time { get; set; }
}