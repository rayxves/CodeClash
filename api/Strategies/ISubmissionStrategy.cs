
using Dtos;

namespace Strategies
{
    public interface ISubmissionStrategy
    {
        Task<SubmissionResultDto> HandleAsync(SubmissionStrategyInput input);
    }
}