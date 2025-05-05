using Models;

namespace Builders;

public class JavaSubmissionBuilder : ISubmissionBuilder
{
 public Language Language => Language.Java;
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