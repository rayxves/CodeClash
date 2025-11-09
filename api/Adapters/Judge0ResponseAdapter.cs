using Dtos;
using Models;
using Services.Extensions;
using Strategies.Enums;

namespace Adapters;

public class Judge0ResponseAdapter : IJudge0ResponseAdapter
{
    public TestCaseResultDto AdaptToTestResult(Judge0Response response, TestCase testCase)
    {
        return new TestCaseResultDto
        {
            TestCaseId = testCase.Id,
            Status = response?.Status?.Description ?? "Error",
            ExpectedOutput = testCase.ExpectedOutput,
            Output = response?.Stdout ?? response?.Stderr ?? "",
            CompileOutput = response?.CompileOutput ?? response?.Message ?? "Ocorreu um erro durante a execução.",
            Passed = response?.Status?.Description == "Accepted",
            Time = response?.Time ?? "0"
        };
    }

    public SubmissionResultDto AdaptToSimpleSubmissionResult(Judge0Response response)
    {
        if (response == null)
        {
            return new SubmissionResultDto
            {
                OverallStatus = SubmissionStatus.ServerError,
                Notification = "Falha ao obter resposta do serviço de avaliação.",
                SimpleExecutionResult = new Judge0Response
                {
                    Stderr = "Erro desconhecido."
                }
            };
        }

        Judge0StatusMapper.EnsureErrorDetailsPresent(response);
        var judge0Status = (SubmissionChain.Judge0Status)response.Status.Id;
        var submissionStatus = judge0Status.ToSubmissionStatus();

        return new SubmissionResultDto
        {
            SimpleExecutionResult = response,
            OverallStatus = submissionStatus
        };
    }
}