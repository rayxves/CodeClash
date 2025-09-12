namespace Facades; 

public interface ISubmissionFacade
{
    Task<Dtos.SubmissionResultDto> SubmitCodeAsync(string sourceCode, string languageName, int? problemId, string userId);
}