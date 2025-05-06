namespace Models;

public class SubmissionRequest
{
    public string Language { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Input { get; set; } = string.Empty;
    public int LanguageId { get; set; }
}
