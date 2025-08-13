

using Builders;
using Dtos;
using Interfaces;
using Mappers;
using Observers;
using SubmissionChain;

namespace Strategies
{
    public class ProblemSubmissionStrategy : ISubmissionStrategy
    {
        private readonly ISubmissionHandler _submissionChain;
        private readonly SubmissionDirector _submissionDirector;
        private readonly IProblemServices _problemRepository;
        private readonly IUserProblemSolutionServices _solutionService;
        private readonly ISubject _submissionPublisher;

        public ProblemSubmissionStrategy(
            ISubmissionHandler submissionChain,
            SubmissionDirector submissionDirector,
            IProblemServices problemRepository,
            IUserProblemSolutionServices solutionService,
            ISubject submissionPublisher)
        {
            _submissionChain = submissionChain;
            _submissionDirector = submissionDirector;
            _problemRepository = problemRepository;
            _solutionService = solutionService;
            _submissionPublisher = submissionPublisher;
        }

        public async Task<SubmissionResultDto> HandleAsync(SubmissionStrategyInput input)
        {
            var problem = await _problemRepository.GetProblemByIdAsync(input.ProblemId.Value);
            if (problem?.TestCases == null || !problem.TestCases.Any())
            {
                throw new InvalidOperationException("Problema não encontrado ou não possui casos de teste.");
            }

            var initialSolution = await _solutionService.CreateInitialSubmissionAsync(input.UserId, input.ProblemId.Value, input.Language.Name, input.SourceCode);

            var results = new List<TestCaseResultDto>();
            var finalResultDto = new SubmissionResultDto();

            foreach (var testCase in problem.TestCases)
            {
                var request = _submissionDirector.ConstructProblemTestRequest(input.SourceCode, input.Language, testCase);
                var context = new SubmissionContext(request);
                await _submissionChain.HandleAsync(context);

                if (context.Response?.Status?.Description == "Compilation Error")
                {
                    initialSolution.MessageOutput = context.Response.CompileOutput ?? "Erro de compilação";
                    await _solutionService.UpdateUserProblemSolutionAsync(initialSolution.ToDto());

                    finalResultDto.OverallStatus = "Compilation Error";
                    finalResultDto.CompilationError = initialSolution.MessageOutput;
                    return finalResultDto;
                }

                var testResult = new TestCaseResultDto
                {
                    TestCaseId = testCase.Id,
                    Status = context.Response?.Status?.Description ?? "Error",
                    Output = context.Response?.Stdout ?? context.Response?.Stderr ?? context.ErrorMessage ?? "",
                    Passed = context.Response?.Status?.Description == "Accepted",
                    Time = context.Response?.Time ?? "0"
                };

                results.Add(testResult);
            }

            finalResultDto.TestResults = results;
            finalResultDto.OverallStatus = results.All(r => r.Passed) ? "Accepted" : "Wrong Answer";

            if (finalResultDto.OverallStatus == "Accepted")
            {
                var successContext = new SubmissionSuccessContext
                {
                    UserId = input.UserId,
                    Problem = problem,
                    Solution = initialSolution,
                    ResultDto = finalResultDto
                };
                await _submissionPublisher.NotifyAsync(successContext);
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