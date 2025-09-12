namespace Models;
public record Language(int Id, string Name, string Judge0Alias)
{
    public static readonly Language Python = new(71, "Python", "python3");
    public static readonly Language Java = new(62, "Java", "java");
    public static readonly Language Cpp = new(54, "C++", "cpp");
    public static readonly Language CSharp = new(51, "C#", "csharp");

    public static IEnumerable<Language> GetAll()
        => new[] { Python, Java, Cpp, CSharp };
}