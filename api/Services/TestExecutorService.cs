using Builders;
using Dtos;
using Interfaces;
using Models;
using SubmissionChain;
using Adapters;

namespace Services.Extensions;

public class TestExecutorService : ITestExecutorService
{
    private readonly SubmissionDirector _submissionDirector;
    private readonly ISubmissionHandler _submissionChain;
    private readonly IJudge0ResponseAdapter _adapter;

    public TestExecutorService(
        SubmissionDirector submissionDirector,
        ISubmissionHandler submissionChain,
        IJudge0ResponseAdapter adapter)
    {
        _submissionDirector = submissionDirector;
        _submissionChain = submissionChain;
        _adapter = adapter;
    }

    public async Task<List<TestCaseResultDto>> ExecuteTestsAsync(SubmissionStrategyInput input, IEnumerable<TestCase> testCases)
    {
        var results = new List<TestCaseResultDto>();

        foreach (var testCase in testCases)
        {
            try
            {
                var request = _submissionDirector.ConstructProblemTestRequest(input.SourceCode, input.Language, testCase);
                var context = new SubmissionContext(request);
                await _submissionChain.HandleAsync(context);

                if (context.Response != null)
                {
                    results.Add(_adapter.AdaptToTestResult(context.Response, testCase));
                }
                else
                {
                    results.Add(new TestCaseResultDto
                    {
                        TestCaseId = testCase.Id,
                        Status = "Error",
                        ExpectedOutput = testCase.ExpectedOutput ?? string.Empty,
                        Output = context.ErrorMessage ?? "Erro desconhecido",
                        CompileOutput = context.ErrorMessage ?? "Ocorreu um erro durante a execução.",
                        Passed = false,
                        Time = "0"
                    });
                }
            }
            catch (Exception ex)
            {
                results.Add(new TestCaseResultDto
                {
                    TestCaseId = testCase.Id,
                    Status = "Error",
                    ExpectedOutput = testCase.ExpectedOutput ?? string.Empty,
                    Output = $"Erro ao executar teste: {ex.Message}",
                    CompileOutput = ex.ToString(),
                    Passed = false,
                    Time = "0"
                });
            }
        }

        return results;
    }
}