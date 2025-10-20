namespace Builders;

public class SubmissionBuilder : ISubmissionRequestBuilder
{
    private string _code = string.Empty;
    private string _languageName = string.Empty;
    private int _languageId;
    private string? _input = null;
    private string? _expectedOutput = null;

    public void Reset()
    {
        _code = string.Empty;
        _languageName = string.Empty;
        _languageId = 0;
        _input = null;
        _expectedOutput = null;
    }

    public ISubmissionRequestBuilder WithCode(string code)
    {
        _code = code;
        return this;
    }

    public ISubmissionRequestBuilder WithLanguage(string name, int id)
    {
        _languageName = name;
        _languageId = id;
        return this;
    }

    public ISubmissionRequestBuilder WithInput(string? input)
    {
        _input = input;
        return this;
    }

    public ISubmissionRequestBuilder WithExpectedOutput(string? expectedOutput)
    {
        _expectedOutput = expectedOutput;
        return this;
    }

    public SubmissionRequest Build()
    {
        var request = new SubmissionRequest(_code, _languageName, _languageId, _input, _expectedOutput);
        return request;
    }
}