

using Builders;
using Dtos;
using Interfaces;
using Mappers;
using Observers;

namespace Strategies
{
    public class ProblemSubmissionStrategy : ISubmissionStrategy
    {
        private readonly IProblemServices _problemServices;
        private readonly IUserProblemSolutionServices _solutionService;
        private readonly ITestExecutorService _testExecutor;
        private readonly ISubject _submissionPublisher;

        public ProblemSubmissionStrategy(
            IProblemServices problemRepository,
            IUserProblemSolutionServices solutionService,
            ITestExecutorService testExecutor,
            ISubject submissionPublisher)
        {
            _problemServices = problemRepository;
            _solutionService = solutionService;
            _testExecutor = testExecutor;
            _submissionPublisher = submissionPublisher;
        }

        public async Task<SubmissionResultDto> HandleAsync(SubmissionStrategyInput input)
        {
            var problem = await _problemServices.GetProblemByIdAsync(input.ProblemId.Value);
         
            var initialSolution = await _solutionService.CreateInitialSubmissionAsync(input.UserId, input.ProblemId.Value, input.Language.Name, input.SourceCode);

            var testResults = await _testExecutor.ExecuteTestsAsync(input, problem.TestCases);

            var finalResultDto = new SubmissionResultDto
            {
                TestResults = testResults,
                OverallStatus = testResults.All(r => r.Passed) ? "Accepted" : "Wrong Answer"
            };

            if (finalResultDto.OverallStatus == "Accepted")
            {
                await _submissionPublisher.NotifyAsync(new SubmissionSuccessContext
                {
                    UserId = input.UserId,
                    Problem = problem,
                    Solution = initialSolution,
                    ResultDto = finalResultDto
                });
            }
            else
            {
                initialSolution.MessageOutput = "Um ou mais testes falharam.";
                await _solutionService.UpdateUserProblemSolutionAsync(initialSolution.ToDto());
            }

            return finalResultDto;
        }
    }

}