using Builders;

namespace Dtos;

public class SubmissionContext
{
    public SubmissionRequest Request { get; }
    public Judge0Response? Response { get; set; }
    public string? ErrorMessage { get; set; }
    public bool IsCompleted { get; set; }

    public SubmissionContext(SubmissionRequest request)
    {
        Request = request;
    }
}