using Interfaces;

namespace Services.Extensions
{
    public class CodeFormatterServices : ICodeFormatterServices
    {
        public string Format(string sourceCode)
        {
           
            return sourceCode.Trim();
        }
    }
}