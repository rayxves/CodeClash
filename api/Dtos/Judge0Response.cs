namespace Dtos;

public class Judge0Response
{

    public string Stdout { get; set; } = string.Empty;
    public string Stderr { get; set; } = string.Empty;
    public string CompileOutput { get; set; } = string.Empty;
    public Judge0Status Status { get; set; }
    public double? Time { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class Judge0Status
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
}