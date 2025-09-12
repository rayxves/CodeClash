using Dtos;

namespace SubmissionChain.Handlers;

public class MemoryLimitExceededHandler : Judge0StatusHandler
{

    protected override int HandledStatusId => (int)Judge0Status.MemoryLimitExceeded;

    protected override string GetErrorMessage(SubmissionContext context)
    {
        return "O código excedeu o limite de memória de execução.";
    }
    
}