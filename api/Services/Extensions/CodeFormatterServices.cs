using System.Text.RegularExpressions;
using Interfaces;

namespace Services.Extensions
{
    public class CodeFormatterServices : ICodeFormatterServices
    {
        public string Format(string sourceCode)
        {
            if (string.IsNullOrEmpty(sourceCode))
            {
                return string.Empty;
            }
            string normalizedCode = Regex.Replace(sourceCode, @"\r\n", "\n");
            string trimmedCode = normalizedCode.Trim();

            return trimmedCode;
        }
    }
}