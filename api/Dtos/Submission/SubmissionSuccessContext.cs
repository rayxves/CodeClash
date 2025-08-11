using Models;

namespace Dtos;

public class SubmissionSuccessContext
{
    public string UserId { get; set; }
    public Problem Problem { get; set; }
    public UserProblemSolution Solution { get; set; }
    public SubmissionResultDto ResultDto { get; set; }
}
