namespace Builders;

public interface ISubmissionRequestBuilder
{
    ISubmissionRequestBuilder WithCode(string code);
    ISubmissionRequestBuilder WithLanguage(string name, int id);
    ISubmissionRequestBuilder WithInput(string? input);
    ISubmissionRequestBuilder WithExpectedOutput(string? expectedOutput);
    SubmissionRequest Build();
    void Reset();
}