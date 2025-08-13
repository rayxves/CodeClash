

namespace Strategies
{
    public class SubmissionStrategySelector : ISubmissionStrategySelector
    {
        private readonly IServiceProvider _serviceProvider;

        public SubmissionStrategySelector(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public ISubmissionStrategy CreateStrategy(SubmissionStrategyInput input)
        {
            if (input.ProblemId.HasValue)
            {
                return (ISubmissionStrategy)_serviceProvider.GetService(typeof(ProblemSubmissionStrategy));
            }
            else
            {
                return (ISubmissionStrategy)_serviceProvider.GetService(typeof(SimpleExecutionStrategy));
            }
        }
    }
}
