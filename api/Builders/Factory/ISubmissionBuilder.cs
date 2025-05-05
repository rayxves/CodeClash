using Models;

namespace Builders;

public interface ISubmissionBuilder
{
    Language Language { get; }
    SubmissionRequest Build(string sourceCode, string input);

}