using Builders;
using Dtos;
using SubmissionChain;

namespace Strategies
{
    public class SimpleExecutionStrategy : ISubmissionStrategy
    {
        private readonly ISubmissionHandler _submissionChain;
        private readonly SubmissionDirector _submissionDirector;

        public SimpleExecutionStrategy(ISubmissionHandler submissionChain, SubmissionDirector submissionDirector)
        {
            _submissionChain = submissionChain;
            _submissionDirector = submissionDirector;
        }

        public async Task<SubmissionResultDto> HandleAsync(SubmissionStrategyInput input)
        {
            var request = _submissionDirector.ConstructSimpleExecutionRequest(input.SourceCode, input.Language);
            var context = new SubmissionContext(request);
            await _submissionChain.HandleAsync(context);

            if (!string.IsNullOrEmpty(context.ErrorMessage))
            {
                throw new InvalidOperationException(context.ErrorMessage);
            }

            if (context.Response == null)
            {
                throw new Exception("Ocorreu um erro desconhecido ao processar a submissão.");
            }

            return new SubmissionResultDto
            {
                SimpleExecutionResult = context.Response,
                OverallStatus = context.Response.Status?.Description ?? "Completed"
            };
        }
    }
}