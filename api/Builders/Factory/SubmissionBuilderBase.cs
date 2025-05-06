using Models;

namespace Builders;
public abstract class SubmissionBuilderBase : ISubmissionBuilder
{
    public abstract Language Language { get; }

    public virtual SubmissionRequest Build(string sourceCode, string input)
    {
        return new SubmissionRequestBuilder()
            .WithCode(sourceCode)
            .WithInput(input)
            .WithLanguage(Language.Judge0Alias)
            .Build();
    }
}
