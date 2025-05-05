using Models;

namespace Builders;

public class CSharpSubmissionBuilder : ISubmissionBuilder
{
 public Language Language => Language.CSharp;
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