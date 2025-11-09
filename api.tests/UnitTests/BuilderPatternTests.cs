using Builders;
using Models;
using Xunit;

namespace UnitTests.Patterns;

public class BuilderPatternTests
{
    [Fact]
    public void SubmissionBuilder_ShouldBuildBasicRequest()
    {
        var builder = new SubmissionBuilder();
        var request = builder
            .WithCode("print('test')")
            .WithLanguage("Python", 71)
            .WithInput("test input")
            .WithExpectedOutput("test output")
            .Build();
        Assert.Equal("print('test')", request.Code);
        Assert.Equal("Python", request.Language);
        Assert.Equal(71, request.LanguageId);
        Assert.Equal("test input", request.Input);
        Assert.Equal("test output", request.ExpectedOutput);
    }

    [Fact]
    public void SubmissionDirector_ShouldConstructSimpleExecutionRequest()
    {
        var builder = new SubmissionBuilder();
        var director = new SubmissionDirector(builder);
        var language = Language.Python;
        var request = director.ConstructSimpleExecutionRequest("print('hello')", language);
        Assert.NotNull(request);
        Assert.Equal("print('hello')", request.Code);
        Assert.Equal("Python", request.Language);
        Assert.Equal(71, request.LanguageId);
        Assert.Null(request.Input);
        Assert.Null(request.ExpectedOutput);
    }

    [Fact]
    public void SubmissionDirector_ShouldConstructProblemTestRequest()
    {
        var builder = new SubmissionBuilder();
        var director = new SubmissionDirector(builder);
        var language = Language.Python;
        var testCase = new TestCase { Id = 1, Input = "5", ExpectedOutput = "10", ProblemId = 1, isHidden = false, Order = 1 };
        var request = director.ConstructProblemTestRequest("print(int(input()) * 2)", language, testCase);
        Assert.NotNull(request);
        Assert.Equal("print(int(input()) * 2)", request.Code);
        Assert.Equal("Python", request.Language);
        Assert.Equal("5", request.Input);
        Assert.Equal("10", request.ExpectedOutput);
    }
}