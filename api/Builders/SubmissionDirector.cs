using Models;

namespace Builders;

public class SubmissionDirector
{
    private readonly ISubmissionRequestBuilder _builder;

    public SubmissionDirector(ISubmissionRequestBuilder builder)
    {
        _builder = builder;
    }

    public SubmissionRequest ConstructSimpleExecutionRequest(string code, Language language)
    {
        _builder.Reset();
        return _builder
            .WithCode(code)
            .WithInput(null)
            .WithExpectedOutput(null)
            .WithLanguage(language.Name, language.Id)
            .Build();
    }

    public SubmissionRequest ConstructProblemTestRequest(string code, Language language, TestCase testCase)
    {
        _builder.Reset();
        return _builder
            .WithCode(code)
            .WithLanguage(language.Name, language.Id)
            .WithInput(testCase.Input)
            .WithExpectedOutput(testCase.ExpectedOutput)
            .Build();
    }
}