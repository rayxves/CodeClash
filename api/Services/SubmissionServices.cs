using Dtos;
using Interfaces;
using Mappers;
using Models;
using Observers;
using Strategies;
using Strategies.Enums;

namespace Services;

public class SubmissionServices : ISubmissionServices
{
    private readonly ISubmissionStrategySelector _strategySelector;
    private readonly IUserProblemSolutionServices _solutionService;
    private readonly ISubject _submissionPublisher;
    private readonly IUnitOfWork _unitOfWork;

    public SubmissionServices(
        ISubmissionStrategySelector strategySelector,
        IUserProblemSolutionServices solutionService,
        ISubject submissionPublisher,
        IUnitOfWork unitOfWork)
    {
        _strategySelector = strategySelector;
        _solutionService = solutionService;
        _submissionPublisher = submissionPublisher;
        _unitOfWork = unitOfWork;
    }

    public async Task<SubmissionResultDto> ProcessSubmissionAsync(SubmissionStrategyInput input)
    {
        var strategy = _strategySelector.SelectStrategy(input);

        UserProblemSolution? initialSolution = input.ProblemId.HasValue
            ? await _solutionService.CreateInitialSubmissionAsync(input.UserId, input.ProblemId.Value, input.Language.Name, input.SourceCode)
            : null;

        var resultDto = await strategy.HandleAsync(input);

        if (initialSolution != null)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                if (resultDto.OverallStatus == SubmissionStatus.Accepted && initialSolution.PointsEarned == 0)
                {
                    var problem = await _unitOfWork.Problems.GetByIdAsync(input.ProblemId!.Value);

                    await _submissionPublisher.NotifyAsync(new SubmissionSuccessContext
                    {
                        UserId = input.UserId,
                        Problem = problem!,
                        Solution = initialSolution,
                        ResultDto = resultDto
                    });

                    await _unitOfWork.CommitTransactionAsync();
                }
                else if (resultDto.OverallStatus != SubmissionStatus.Accepted && !initialSolution.IsApproved)
                {
                    initialSolution.MessageOutput = "Um ou mais testes falharam.";
                    await _solutionService.UpdateUserProblemSolutionAsync(initialSolution.ToDto());
                    await _unitOfWork.CommitTransactionAsync();
                }
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        return resultDto;
    }
}