using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Dtos;


public class SubmissionRequestDto
{
    [JsonPropertyName("code")]
    public string Code { get; set; }

    [JsonPropertyName("language")]
    public string Language { get; set; }

    [JsonPropertyName("problemId")]
    public int? ProblemId { get; set; } = null;
}
