using System.ComponentModel.DataAnnotations;

namespace Dtos;

public class SubmissionRequestDto
{
    [Required]
    public string Language { get; set; } = string.Empty;
    [Required]
    public string Code { get; set; } = string.Empty;
    public string Input { get; set; } = string.Empty;


}