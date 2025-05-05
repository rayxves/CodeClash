using Models;

namespace Builders
{
    public class SubmissionRequestBuilder
    {
        private string _code;
        private string _input;
        private string _language;

        public SubmissionRequestBuilder WithCode(string code)
        {
            _code = code;
            return this;
        }

        public SubmissionRequestBuilder WithInput(string input)
        {
            _input = input;
            return this;
        }

        public SubmissionRequestBuilder WithLanguage(string language)
        {
            _language = language;
            return this;
        }


        public SubmissionRequest Build()
        {
            return new SubmissionRequest
            {
                Code = _code,
                Input = _input,
                Language = _language,
            };
        }
    }
}
