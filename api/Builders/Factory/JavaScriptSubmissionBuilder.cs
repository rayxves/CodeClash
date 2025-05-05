using Models;

namespace Builders;

public class JavaScriptSubmissionBuilder : ISubmissionBuilder
{
    public Language Language => Language.JavaScript;
    public SubmissionRequest Build(string sourceCode, string input)
    {
        return new SubmissionRequest
        {
            Language = Language.Judge0Alias,
            Code = sourceCode,
            Input = input,
        };
    }
}