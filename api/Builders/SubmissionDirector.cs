
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
        _builder
            .WithCode(code)
            .WithInput(null)
            .WithExpectedOutput(null)
            .WithLanguage(language.Name, language.Id);

        return _builder.Build();
    }

    public SubmissionRequest ConstructProblemTestRequest(string code, Language language, TestCase testCase)
    {
        _builder
            .WithCode(code)
            .WithLanguage(language.Name, language.Id)
            .WithInput(testCase.Input)
            .WithExpectedOutput(testCase.ExpectedOutput);

        return _builder.Build();
    }
}