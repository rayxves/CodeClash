using Models;

namespace Builders
{
    public class SubmissionRequestBuilder
    {
        private readonly SubmissionRequest _request = new();

        public SubmissionRequestBuilder WithCode(string code)
        {
            _request.Code = code;
            return this;
        }

        public SubmissionRequestBuilder WithInput(string input)
        {
            _request.Input = input;
            return this;
        }

        public SubmissionRequestBuilder WithLanguage(string language)
        {
            _request.Language = language;
            return this;
        }

        public SubmissionRequestBuilder WithLanguageId(int languageId)
        {
            _request.LanguageId = languageId;
            return this;
        }

        public SubmissionRequest Build() => _request;

        public static SubmissionRequest Create(string code, string input, string language, int languageId) =>
            new SubmissionRequestBuilder()
                .WithCode(code)
                .WithInput(input)
                .WithLanguage(language)
                .WithLanguageId(languageId)
                .Build();
    }
}