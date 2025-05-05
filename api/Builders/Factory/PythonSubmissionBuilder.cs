using Models;

namespace Builders;

public class PythonSubmissionBuilder : ISubmissionBuilder
{
 public Language Language => Language.Python;
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