using Models;

namespace Builders;

public interface ISubmissionRequestBuilder
{
    ISubmissionRequestBuilder WithCode(string code);
    ISubmissionRequestBuilder WithInput(string input);
    ISubmissionRequestBuilder WithLanguage(string language);
    ISubmissionRequestBuilder WithLanguageId(int languageId);
    SubmissionRequest Build();
}