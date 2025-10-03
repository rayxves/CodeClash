using Dtos;
using Interfaces;
using Models;
using Moq;
using Strategies;
using Xunit;
using Builders;
using SubmissionChain;

namespace UnitTests.Patterns;

public class StrategyPatternTests
{
    [Fact]
    public void ProblemSubmissionStrategy_CanHandle_ShouldReturnTrue_WithProblemId()
    {
        var mockProblemService = new Mock<IProblemServices>();
        var mockTestExecutor = new Mock<ITestExecutorService>();
        var strategy = new ProblemSubmissionStrategy(mockProblemService.Object, mockTestExecutor.Object);
        var input = new SubmissionStrategyInput("code", Language.Python, "user1", 1);
        Assert.True(strategy.CanHandle(input));
    }

    [Fact]
    public void ProblemSubmissionStrategy_CanHandle_ShouldReturnFalse_WithoutProblemId()
    {
        var mockProblemService = new Mock<IProblemServices>();
        var mockTestExecutor = new Mock<ITestExecutorService>();
        var strategy = new ProblemSubmissionStrategy(mockProblemService.Object, mockTestExecutor.Object);
        var input = new SubmissionStrategyInput("code", Language.Python, "user1", null);
        Assert.False(strategy.CanHandle(input));
    }

    [Fact]
    public void SimpleExecutionStrategy_CanHandle_ShouldReturnTrue_WithoutProblemId()
    {
        var mockHandler = new Mock<ISubmissionHandler>();
        var mockDirector = new Mock<SubmissionDirector>(new Mock<ISubmissionRequestBuilder>().Object);
        var strategy = new SimpleExecutionStrategy(mockHandler.Object, mockDirector.Object);
        var input = new SubmissionStrategyInput("code", Language.Python, "user1", null);
        Assert.True(strategy.CanHandle(input));
    }

    [Fact]
    public void SimpleExecutionStrategy_CanHandle_ShouldReturnTrue_WithNullProblemId()
    {
        var mockHandler = new Mock<ISubmissionHandler>();
        var mockDirector = new Mock<SubmissionDirector>(new Mock<ISubmissionRequestBuilder>().Object);
        var strategy = new SimpleExecutionStrategy(mockHandler.Object, mockDirector.Object);
        var input = new SubmissionStrategyInput("code", Language.Python, "user1");
        Assert.True(strategy.CanHandle(input));
    }

    [Fact]
    public void SubmissionStrategySelector_ShouldSelectProblemStrategy_WithProblemId()
    {
        var mockProblemService = new Mock<IProblemServices>();
        var mockTestExecutor = new Mock<ITestExecutorService>();
        var mockHandler = new Mock<ISubmissionHandler>();
        var mockDirector = new Mock<SubmissionDirector>(new Mock<ISubmissionRequestBuilder>().Object);
        var strategies = new List<ISubmissionStrategy>
        {
            new ProblemSubmissionStrategy(mockProblemService.Object, mockTestExecutor.Object),
            new SimpleExecutionStrategy(mockHandler.Object, mockDirector.Object)
        };
        var selector = new SubmissionStrategySelector(strategies);
        var input = new SubmissionStrategyInput("code", Language.Python, "user1", 1);
        var selected = selector.SelectStrategy(input);
        Assert.IsType<ProblemSubmissionStrategy>(selected);
    }

    [Fact]
    public void SubmissionStrategySelector_ShouldSelectSimpleStrategy_WithoutProblemId()
    {
        var mockProblemService = new Mock<IProblemServices>();
        var mockTestExecutor = new Mock<ITestExecutorService>();
        var mockHandler = new Mock<ISubmissionHandler>();
        var mockDirector = new Mock<SubmissionDirector>(new Mock<ISubmissionRequestBuilder>().Object);
        var strategies = new List<ISubmissionStrategy>
        {
            new ProblemSubmissionStrategy(mockProblemService.Object, mockTestExecutor.Object),
            new SimpleExecutionStrategy(mockHandler.Object, mockDirector.Object)
        };
        var selector = new SubmissionStrategySelector(strategies);
        var input = new SubmissionStrategyInput("code", Language.Python, "user1");
        var selected = selector.SelectStrategy(input);
        Assert.IsType<SimpleExecutionStrategy>(selected);
    }
}