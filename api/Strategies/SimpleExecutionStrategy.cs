using Builders;
using Dtos;
using SubmissionChain;
using Adapters;

namespace Strategies;

public class SimpleExecutionStrategy : ISubmissionStrategy
{
    private readonly ISubmissionHandler _submissionChain;
    private readonly SubmissionDirector _submissionDirector;
    private readonly IJudge0ResponseAdapter _adapter;

    public SimpleExecutionStrategy(
        ISubmissionHandler submissionChain,
        SubmissionDirector submissionDirector,
        IJudge0ResponseAdapter adapter)
    {
        _submissionChain = submissionChain;
        _submissionDirector = submissionDirector;
        _adapter = adapter;
    }

    public bool CanHandle(SubmissionStrategyInput input) => input.ProblemId == null || !input.ProblemId.HasValue;

    public async Task<SubmissionResultDto> HandleAsync(SubmissionStrategyInput input)
    {
        var request = _submissionDirector.ConstructSimpleExecutionRequest(input.SourceCode, input.Language);
        var context = new SubmissionContext(request);

        await _submissionChain.HandleAsync(context);

        return _adapter.AdaptToSimpleSubmissionResult(context.Response);
    }
}