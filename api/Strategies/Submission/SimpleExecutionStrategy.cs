using Builders;
using Dtos;
using SubmissionChain;
using Strategies.Enums;
using Services.Extensions;

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

        public bool CanHandle(SubmissionStrategyInput input) => input.ProblemId == null || !input.ProblemId.HasValue;

        public async Task<SubmissionResultDto> HandleAsync(SubmissionStrategyInput input)
        {
            var request = _submissionDirector.ConstructSimpleExecutionRequest(input.SourceCode, input.Language);
            var context = new SubmissionContext(request);

            await _submissionChain.HandleAsync(context);

            if (context.Response == null)
            {
                return new SubmissionResultDto
                {
                    OverallStatus = SubmissionStatus.ServerError,
                    Notification = context.ErrorMessage ?? "Falha ao obter resposta do serviço de avaliação.",
                    SimpleExecutionResult = new Judge0Response
                    {
                        Stderr = context.ErrorMessage ?? "Erro desconhecido."
                    }
                };
            }


            Judge0StatusMapper.EnsureErrorDetailsPresent(context.Response);

            var judge0Status = (SubmissionChain.Judge0Status)context.Response.Status.Id;
            var submissionStatus = judge0Status.ToSubmissionStatus();

            return new SubmissionResultDto
            {
                SimpleExecutionResult = context.Response,
                OverallStatus = submissionStatus
            };
        }

    }
}