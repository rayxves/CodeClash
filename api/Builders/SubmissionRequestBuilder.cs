using Models;
namespace Builders;
public class SubmissionRequestBuilder : ISubmissionRequestBuilder
{
    private readonly SubmissionRequest _request = new();

    public ISubmissionRequestBuilder WithCode(string code)
    {
        _request.Code = code ?? throw new ArgumentNullException(nameof(code));
        return this;
    }

    public ISubmissionRequestBuilder WithInput(string input)
    {
        _request.Input = input ?? string.Empty;
        return this;
    }

    public ISubmissionRequestBuilder WithLanguage(string language)
    {
        _request.Language = language ?? throw new ArgumentNullException(nameof(language));
        return this;
    }

    public ISubmissionRequestBuilder WithLanguageId(int languageId)
    {
        if (languageId <= 0)
            throw new ArgumentOutOfRangeException(nameof(languageId));
        _request.LanguageId = languageId;
        return this;
    }

    public SubmissionRequest Build()
    {
        return new SubmissionRequest
        {
            Code = _request.Code,
            Input = _request.Input,
            Language = _request.Language,
            LanguageId = _request.LanguageId
        };
    }
}
