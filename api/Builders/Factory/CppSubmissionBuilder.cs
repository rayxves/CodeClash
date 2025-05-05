using Models;

namespace Builders;

public class CppSubmissionBuilder : ISubmissionBuilder
{
 public Language Language => Language.Cpp;
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