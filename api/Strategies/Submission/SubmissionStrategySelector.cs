using Dtos;
namespace Strategies
{
    public class SubmissionStrategySelector : ISubmissionStrategySelector
    {
        private readonly IEnumerable<ISubmissionStrategy> _strategies;

        public SubmissionStrategySelector(IEnumerable<ISubmissionStrategy> strategies)
        {
            _strategies = strategies;
        }

        public ISubmissionStrategy SelectStrategy(SubmissionStrategyInput input)
        {
            var strategy = _strategies.FirstOrDefault(s => s.CanHandle(input));

            if (strategy == null)
            {
                throw new InvalidOperationException("Não foi encontrada uma estratégia adequada para a submissão.");
            }

            return strategy;
        }
    }
}