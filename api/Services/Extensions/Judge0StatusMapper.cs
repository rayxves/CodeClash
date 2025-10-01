using Dtos;
using SubmissionChain;

namespace Services.Extensions;

public static class Judge0StatusMapper
{
    public static string GetDefaultErrorMessage(SubmissionChain.Judge0Status status)
    {
        return status switch
        {
            SubmissionChain.Judge0Status.CompilationError => "Erro de compilação detectado. Verifique a sintaxe do seu código.",
            SubmissionChain.Judge0Status.RuntimeErrorSigsegv => "Segmentation Fault: Acesso inválido à memória.",
            SubmissionChain.Judge0Status.RuntimeErrorSigfpe => "Floating Point Exception: Divisão por zero ou operação matemática inválida.",
            SubmissionChain.Judge0Status.RuntimeErrorAborted => "Programa abortado durante a execução.",
            SubmissionChain.Judge0Status.RuntimeErrorNzec => "O programa terminou com código de erro não-zero.",
            SubmissionChain.Judge0Status.TimeLimitExceeded => "Tempo limite excedido. Seu código demorou muito para executar.",
            SubmissionChain.Judge0Status.MemoryLimitExceeded => "Limite de memória excedido.",
            SubmissionChain.Judge0Status.OutputLimitExceeded => "Limite de saída excedido.",
            SubmissionChain.Judge0Status.InternalError => "Erro interno do servidor de avaliação.",
            SubmissionChain.Judge0Status.UnprocessableEntity => "Não foi possível processar sua submissão.",
            _ => "Ocorreu um erro durante a execução."
        };
    }

    public static void EnsureErrorDetailsPresent(Judge0Response response)
    {
        if (response?.Status == null || response.Status.Id == (int)SubmissionChain.Judge0Status.Accepted)
            return;

        var hasDetails = !string.IsNullOrWhiteSpace(response.Stdout) ||
                        !string.IsNullOrWhiteSpace(response.Stderr) ||
                        !string.IsNullOrWhiteSpace(response.CompileOutput) ||
                        !string.IsNullOrWhiteSpace(response.Message);

        if (hasDetails)
        {
            NormalizeCompilationError(response);
            return;
        }

        var status = (SubmissionChain.Judge0Status)response.Status.Id;
      
        var defaultMessage = GetDefaultErrorMessage(status);

        switch (status)
        {
            case SubmissionChain.Judge0Status.CompilationError:
                response.CompileOutput = defaultMessage;
                break;

            case SubmissionChain.Judge0Status.RuntimeErrorSigsegv:
            case SubmissionChain.Judge0Status.RuntimeErrorSigfpe:
            case SubmissionChain.Judge0Status.RuntimeErrorAborted:
            case SubmissionChain.Judge0Status.RuntimeErrorNzec:
                response.Stderr = defaultMessage;
                break;

            default:
                response.Message = defaultMessage;
                break;
        }
    }

    private static void NormalizeCompilationError(Judge0Response response)
    {
        if (response.Status.Id == (int)SubmissionChain.Judge0Status.CompilationError &&
            string.IsNullOrWhiteSpace(response.CompileOutput) &&
            !string.IsNullOrWhiteSpace(response.Stderr))
        {
            response.CompileOutput = response.Stderr;
        }
    }
}