namespace Builders;

public class SubmissionRequest
{
    public string Language { get; }
    public int LanguageId { get; }
    public string Code { get; }
    public string? Input { get; }
    public string? ExpectedOutput { get; }

    internal SubmissionRequest(string code, string language, int languageId, string? input, string? expectedOutput)
    {
        Code = code ?? throw new ArgumentNullException(nameof(code));
        Language = language ?? throw new ArgumentNullException(nameof(language));
        LanguageId = languageId;
        Input = input;
        ExpectedOutput = expectedOutput;
    }

    public override bool Equals(object? obj)
    {
        return obj is SubmissionRequest other &&
               Language == other.Language &&
               LanguageId == other.LanguageId &&
               Code == other.Code &&
               Input == other.Input &&
               ExpectedOutput == other.ExpectedOutput;
    }

}