namespace Builders;

public class SubmissionRequest
{
    public string Language { get; private set; }
    public int LanguageId { get; private set; }
    public string Code { get; private set; }
    public string? Input { get; private set; } = null;
    public string? ExpectedOutput { get; private set; } = null;

    internal SubmissionRequest(string code, string language, int languageId, string? input, string? expectedOutput)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new ArgumentException("O código fonte não pode ser nulo ou vazio.", nameof(code));

        if (string.IsNullOrWhiteSpace(language))
            throw new ArgumentException("A linguagem não pode ser nula ou vazia.", nameof(language));

        if (languageId <= 0)
            throw new ArgumentOutOfRangeException(nameof(languageId), "O ID da linguagem deve ser positivo.");

        Code = code;
        Language = language;
        LanguageId = languageId;
        Input = input != null ? input : null;
        ExpectedOutput = expectedOutput != null ? expectedOutput : null;
    }
}