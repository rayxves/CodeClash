
using Dtos;
using Interfaces;
using Models;
using Strategies;


namespace Facades
{
    public class SubmissionFacade : ISubmissionFacade
    {
        private readonly ISubmissionStrategySelector _strategySelector;
        private readonly ICodeFormatterServices _codeFormatterService;
        private readonly ILanguageResolver _languageResolver;

        public SubmissionFacade(
            ISubmissionStrategySelector strategySelector,
            ICodeFormatterServices codeFormatterService,
            ILanguageResolver languageResolver)
        {
            _strategySelector = strategySelector;
            _codeFormatterService = codeFormatterService;
            _languageResolver = languageResolver;
        }

        public async Task<SubmissionResultDto> SubmitCodeAsync(string sourceCode, string languageName, int? problemId, string userId)
        {
            var language = _languageResolver.Resolve(languageName);
            var codeFormatted = _codeFormatterService.Format(sourceCode);
            var input = new SubmissionStrategyInput(codeFormatted, language, userId, problemId);

            var strategy = _strategySelector.CreateStrategy(input);
            return await strategy.HandleAsync(input);
        }
    }
}