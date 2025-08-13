namespace Strategies;

public interface ISubmissionStrategySelector
{
    ISubmissionStrategy CreateStrategy(SubmissionStrategyInput input);
}