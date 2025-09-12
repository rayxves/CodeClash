using Dtos;

namespace SubmissionChain.Handlers;

public class CompilationErrorHandler : Judge0StatusHandler
{
    protected override int HandledStatusId => (int)Judge0Status.CompilationError;

    protected override string GetErrorMessage(SubmissionContext context)
    {
        return context.Response?.CompileOutput ?? "Erro de compilação desconhecido.";
    }
}