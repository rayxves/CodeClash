using Dtos;

namespace Models;

public class SubmissionContext
{
    public SubmissionRequest Request { get; set; }
    public Judge0Response Response { get; set; }
    public bool IsCompleted { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
}