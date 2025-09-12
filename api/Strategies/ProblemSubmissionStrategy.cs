using Dtos;
using Interfaces;
using Strategies.Enums;

namespace Strategies
{
    public class ProblemSubmissionStrategy : ISubmissionStrategy
    {
        private readonly IProblemServices _problemServices;
        private readonly ITestExecutorService _testExecutor;

        public ProblemSubmissionStrategy(IProblemServices problemServices, ITestExecutorService testExecutor)
        {
            _problemServices = problemServices;
            _testExecutor = testExecutor;
        }

        public bool CanHandle(SubmissionStrategyInput input) => input.ProblemId.HasValue;

        public async Task<SubmissionResultDto> HandleAsync(SubmissionStrategyInput input)
        {
            var problem = await _problemServices.GetProblemByIdAsync(input.ProblemId.Value);
            var testResults = await _testExecutor.ExecuteTestsAsync(input, problem.TestCases);

            bool allTestsPassed = testResults.All(r => r.Passed);

            return new SubmissionResultDto
            {
                TestResults = testResults,
                OverallStatus = allTestsPassed ? SubmissionStatus.Accepted : SubmissionStatus.WrongAnswer
            };
        }
    }
}