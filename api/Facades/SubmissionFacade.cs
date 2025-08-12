
using Builders;
using Data;
using Dtos;
using Interfaces;
using Mappers;
using Models;
using Observers;
using SubmissionChain;

namespace Facades;

public class SubmissionFacade : ISubmissionFacade
{
    private readonly ISubmissionHandler _submissionChain;
    private readonly IProblemServices _problemRepository;
    private readonly SubmissionDirector _submissionDirector;
    private readonly ICodeFormatterServices _codeFormatterService;
    private readonly ISubject _submissionPublisher;
    private readonly IUserProblemSolutionServices _solutionService;
    public SubmissionFacade(IJudge0Services judge0Service, IProblemServices problemRepository, ISubmissionBuilder submissionBuilder, ICodeFormatterServices codeFormatterService, ISubject submissionPublisher, IUserProblemSolutionServices solutionService)
    {
        _codeFormatterService = codeFormatterService;
        _problemRepository = problemRepository;
        _submissionChain = SubmissionChainFactory.Create(judge0Service);
        _submissionDirector = new SubmissionDirector(submissionBuilder);
        _submissionPublisher = submissionPublisher;
        _solutionService = solutionService;
    }

    public async Task<Dtos.SubmissionResultDto> SubmitCodeAsync(string sourceCode, string languageName, int? problemId, string userId)
    {
        var language = Language.GetAll().FirstOrDefault(l => l.Name.Equals(languageName, StringComparison.OrdinalIgnoreCase) || l.Judge0Alias.Equals(languageName, StringComparison.OrdinalIgnoreCase));

        if (language == null)
        {
            throw new InvalidOperationException("Linguagem de programação inválida ou não suportada.");
        }
        var codeFormatted = _codeFormatterService.Format(sourceCode);

        if (problemId.HasValue)
        {
            return await HandleProblemSubmissionAsync(codeFormatted, language, problemId.Value, userId);
        }
        else
        {
            return await HandleSimpleExecutionAsync(codeFormatted, language);
        }
    }

    private async Task<SubmissionResultDto> HandleProblemSubmissionAsync(string sourceCode, Language language, int problemId, string userId)
    {
        var problem = await _problemRepository.GetProblemByIdAsync(problemId);
        if (problem?.TestCases == null || !problem.TestCases.Any())
        {
            throw new InvalidOperationException("Problema não encontrado ou não possui casos de teste.");
        }

        var initialSolution = await _solutionService.CreateInitialSubmissionAsync(userId, problemId, language.Name, sourceCode);

        var results = new List<TestCaseResultDto>();
        var finalResultDto = new SubmissionResultDto();

        foreach (var testCase in problem.TestCases)
        {
            var request = _submissionDirector.ConstructProblemTestRequest(sourceCode, language, testCase);
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
                UserId = userId,
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

    private async Task<SubmissionResultDto> HandleSimpleExecutionAsync(string sourceCode, Language language)
    {
        var request = _submissionDirector.ConstructSimpleExecutionRequest(sourceCode, language);
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