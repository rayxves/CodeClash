namespace Builders;

public interface ISubmissionBuilder
{
    ISubmissionBuilder WithCode(string code);
    ISubmissionBuilder WithLanguage(string name, int id);
    ISubmissionBuilder WithInput(string? input);
    ISubmissionBuilder WithExpectedOutput(string? expectedOutput);
    SubmissionRequest Build();
    void Reset();
}