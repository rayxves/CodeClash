using Dtos;

namespace Strategies
{
    public interface ISubmissionStrategy
    {
        bool CanHandle(SubmissionStrategyInput input);
        Task<SubmissionResultDto> HandleAsync(SubmissionStrategyInput input);
    }
}