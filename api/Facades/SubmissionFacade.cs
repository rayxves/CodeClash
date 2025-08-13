
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

        public SubmissionFacade(ISubmissionStrategySelector strategyFactory, ICodeFormatterServices codeFormatterService)
        {
            _strategySelector = strategyFactory;
            _codeFormatterService = codeFormatterService;
        }

        public async Task<SubmissionResultDto> SubmitCodeAsync(string sourceCode, string languageName, int? problemId, string userId)
        {
            var language = Language.GetAll().FirstOrDefault(l => l.Name.Equals(languageName, StringComparison.OrdinalIgnoreCase) || l.Judge0Alias.Equals(languageName, StringComparison.OrdinalIgnoreCase));
            if (language == null)
            {
                throw new InvalidOperationException("Linguagem de programação inválida ou não suportada.");
            }

            var codeFormatted = _codeFormatterService.Format(sourceCode);
            var input = new SubmissionStrategyInput(codeFormatted, language, userId, problemId);

            var strategy = _strategySelector.CreateStrategy(input);
            return await strategy.HandleAsync(input);
        }
    }
}