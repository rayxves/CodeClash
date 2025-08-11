namespace Builders;

public class SubmissionBuilder : ISubmissionBuilder
{
    private string _code = string.Empty;
    private string _languageName = string.Empty;
    private int _languageId;
    private string? _input;
    private string? _expectedOutput;

    public SubmissionBuilder()
    {
        Reset();
    }

    public void Reset()
    {
        _code = string.Empty;
        _languageName = string.Empty;
        _languageId = 0;
        _input = null;
        _expectedOutput = null;
    }

    public ISubmissionBuilder WithCode(string code)
    {
        _code = code;
        return this;
    }

    public ISubmissionBuilder WithLanguage(string name, int id)
    {
        _languageName = name;
        _languageId = id;
        return this;
    }

    public ISubmissionBuilder WithInput(string? input)
    {
        _input = input;
        return this;
    }

    public ISubmissionBuilder WithExpectedOutput(string? expectedOutput)
    {
        _expectedOutput = expectedOutput;
        return this;
    }

    public SubmissionRequest Build()
    {
        var request = new SubmissionRequest(_code, _languageName, _languageId, _input, _expectedOutput);
        Reset();
        return request;
    }
}