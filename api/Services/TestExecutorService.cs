using Builders;
using Dtos;
using Interfaces;
using Mappers;
using Models;
using Strategies;
using SubmissionChain;

namespace Services.Extensions;

public class TestExecutorService : ITestExecutorService
{
    private readonly SubmissionDirector _submissionDirector;
    private readonly ISubmissionHandler _submissionChain;
    private readonly IUserProblemSolutionServices _solutionService;

    public TestExecutorService(SubmissionDirector submissionDirector, ISubmissionHandler submissionChain, IUserProblemSolutionServices solutionService)
    {
        _submissionDirector = submissionDirector;
        _submissionChain = submissionChain;
        _solutionService = solutionService;
    }

    public async Task<List<TestCaseResultDto>> ExecuteTestsAsync(SubmissionStrategyInput input, IEnumerable<TestCase> testCases)
    {
        var results = new List<TestCaseResultDto>();

        foreach (var testCase in testCases)
        {
            var request = _submissionDirector.ConstructProblemTestRequest(input.SourceCode, input.Language, testCase);
            var context = new SubmissionContext(request);
            await _submissionChain.HandleAsync(context);

            results.Add(new TestCaseResultDto
            {
                TestCaseId = testCase.Id,
                Status = context.Response?.Status?.Description ?? "Error",
                ExpectedOutput = context.Request?.ExpectedOutput ?? "",
                Output = context.Response?.Stdout ?? context.Response?.Stderr ?? context.ErrorMessage ?? "",
                CompileOutput = context.Response?.CompileOutput ?? context.Response?.Message ?? "Ocorreu um erro durante a execução.",
                Passed = context.Response?.Status?.Description == "Accepted",
                Time = context.Response?.Time ?? "0"
            });
        }

        return results;
    }
}