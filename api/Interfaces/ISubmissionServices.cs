using Dtos;

namespace Interfaces;

public interface ISubmissionServices
{
    Task<SubmissionResultDto> ProcessSubmissionAsync(SubmissionStrategyInput input);
}