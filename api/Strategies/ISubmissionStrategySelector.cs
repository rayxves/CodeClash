
using Dtos;

namespace Strategies
{
    public interface ISubmissionStrategySelector
    {
        ISubmissionStrategy SelectStrategy(SubmissionStrategyInput input);
    }
}