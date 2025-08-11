
using Builders;
using Dtos;
using Interfaces;
using Models;
using SubmissionChain;

namespace Facades;

public class SubmissionFacade
{
    private readonly ISubmissionHandler _submissionChain;
    private readonly IProblemServices _problemRepository;
    private readonly SubmissionDirector _submissionDirector;

    public SubmissionFacade(IJudge0Services judge0Service, IProblemServices problemRepository, ISubmissionBuilder submissionBuilder)
    {
        _problemRepository = problemRepository;
        _submissionChain = SubmissionChainFactory.Create(judge0Service);
        _submissionDirector = new SubmissionDirector(submissionBuilder);
    }

    public async Task<Dtos.SubmissionResultDto> SubmitCodeAsync(string sourceCode, string languageName, int? problemId)
    {
        var language = Language.GetAll().FirstOrDefault(l => l.Name.Equals(languageName, StringComparison.OrdinalIgnoreCase) || l.Judge0Alias.Equals(languageName, StringComparison.OrdinalIgnoreCase));

        if (language == null)
        {
            throw new InvalidOperationException("Linguagem de programação inválida ou não suportada.");
        }

        if (problemId.HasValue)
        {
            return await HandleProblemSubmissionAsync(sourceCode, language, problemId.Value);
        }
        else
        {
            return await HandleSimpleExecutionAsync(sourceCode, language);
        }
    }

    private async Task<SubmissionResultDto> HandleProblemSubmissionAsync(string sourceCode, Language language, int problemId)
    {
        var problem = await _problemRepository.GetProblemByIdAsync(problemId);
        if (problem?.TestCases == null || !problem.TestCases.Any())
        {
            throw new InvalidOperationException("Problema não encontrado ou não possui casos de teste.");
        }

        var results = new List<TestCaseResultDto>();

        foreach (var testCase in problem.TestCases)
        {
            var request = _submissionDirector.ConstructProblemTestRequest(sourceCode, language, testCase);
            var context = new SubmissionContext(request);
            await _submissionChain.HandleAsync(context);

            if (context.Response?.Status?.Description == "Compilation Error")
            {
                return new SubmissionResultDto
                {
                    OverallStatus = "Compilation Error",
                    CompilationError = context.Response.CompileOutput ?? context.Response.Stderr
                };
            }

            results.Add(new TestCaseResultDto
            {
                TestCaseId = testCase.Id,
                Status = context.Response?.Status?.Description ?? "Error",
                Output = context.Response?.Stdout ?? context.Response?.Stderr ?? context.ErrorMessage ?? "",
                Passed = context.Response?.Status?.Description == "Accepted"
            });
        }

        return new SubmissionResultDto
        {
            TestResults = results,
            OverallStatus = results.All(r => r.Passed) ? "Accepted" : "Wrong Answer"
        };
    }

    private async Task<SubmissionResultDto> HandleSimpleExecutionAsync(string sourceCode, Language language)
    {
        var request = _submissionDirector.ConstructSimpleExecutionRequest(sourceCode, language);
        Console.WriteLine($"Submitting code for execution: {request.Code}");
        Console.WriteLine($"Submitting code for execution: {request.Input}");
        Console.WriteLine($"Submitting code for execution: {request.ExpectedOutput}");
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