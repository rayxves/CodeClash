using Dtos;
using Interfaces;
using Services; 

namespace Facades
{
    public class SubmissionFacade : ISubmissionFacade
    {
        private readonly ISubmissionServices _submissionService; 
        private readonly ICodeFormatterServices _codeFormatterService;
        private readonly ILanguageResolver _languageResolver;

        public SubmissionFacade(
            ISubmissionServices submissionService, 
            ICodeFormatterServices codeFormatterService,
            ILanguageResolver languageResolver)
        {
            _submissionService = submissionService;
            _codeFormatterService = codeFormatterService;
            _languageResolver = languageResolver;
        }

        public async Task<SubmissionResultDto> SubmitCodeAsync(string sourceCode, string languageName, int? problemId, string userId)
        {
            var language = _languageResolver.Resolve(languageName);
            var codeFormatted = _codeFormatterService.Format(sourceCode);
            var input = new SubmissionStrategyInput(codeFormatted, language, userId, problemId);

            return await _submissionService.ProcessSubmissionAsync(input);
        }
    }
}