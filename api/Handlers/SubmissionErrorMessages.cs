namespace Validators;

public static class SubmissionErrorMessages
{
    public const string CodeEmpty = "O código não pode ser vazio.";
    public const string Timeout = "Tempo limite excedido. Otimize seu código!";
    public static string Compilation(string output) => $"Erro de compilação: {output}";
    public static string Runtime(string stderr) => $"Erro em tempo de execução: {stderr}";
    public static string SendFail(string ex) => $"Falha ao enviar para Judge0: {ex}";
}
