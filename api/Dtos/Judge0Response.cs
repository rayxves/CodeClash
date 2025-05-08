using System.Text.Json.Serialization;
namespace Dtos;
public class Judge0Response
{
    [JsonPropertyName("stdout")]
    public string Stdout { get; set; } = string.Empty;

    [JsonPropertyName("stderr")]
    public string Stderr { get; set; } = string.Empty;

    [JsonPropertyName("compile_output")]
    public string CompileOutput { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public Judge0Status Status { get; set; } = new();

    [JsonPropertyName("time")]
    public string Time { get; set; } = string.Empty;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}

public class Judge0Status
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
}
