using Data;
using Dtos;
using Interfaces;
using Mappers;
using Observers;
using Strategies;
using Strategies.Enums;

namespace Services
{
    public class SubmissionServices : ISubmissionServices
    {
        private readonly ISubmissionStrategySelector _strategySelector;
        private readonly IUserProblemSolutionServices _solutionService;
        private readonly ISubject _submissionPublisher;
        private readonly ApplicationDbContext _context;

        public SubmissionServices(
            ISubmissionStrategySelector strategySelector,
            IUserProblemSolutionServices solutionService,
            ISubject submissionPublisher,
            ApplicationDbContext context)
        {
            _strategySelector = strategySelector;
            _solutionService = solutionService;
            _submissionPublisher = submissionPublisher;
            _context = context;
        }

        public async Task<SubmissionResultDto> ProcessSubmissionAsync(SubmissionStrategyInput input)
        {
            var strategy = _strategySelector.SelectStrategy(input);


            var initialSolution = input.ProblemId.HasValue
                ? await _solutionService.CreateInitialSubmissionAsync(input.UserId, input.ProblemId.Value, input.Language.Name, input.SourceCode)
                : null;

            var resultDto = await strategy.HandleAsync(input);

            if (initialSolution != null)
            {

                if (resultDto.OverallStatus == SubmissionStatus.Accepted && initialSolution.PointsEarned == 0)
                {
                    await _submissionPublisher.NotifyAsync(new SubmissionSuccessContext
                    {
                        UserId = input.UserId,
                        Problem = await _context.Problems.FindAsync(input.ProblemId.Value),
                        Solution = initialSolution,
                        ResultDto = resultDto
                    });

                    await _context.SaveChangesAsync();
                }
                else if (resultDto.OverallStatus != SubmissionStatus.Accepted && !initialSolution.IsApproved)
                {
                    initialSolution.MessageOutput = "Um ou mais testes falharam.";
                    await _solutionService.UpdateUserProblemSolutionAsync(initialSolution.ToDto());
                }
            }
            
            return resultDto;
        }
    }
}