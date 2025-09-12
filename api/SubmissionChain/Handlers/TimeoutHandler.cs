using Dtos;

namespace SubmissionChain.Handlers;

public class TimeoutHandler : Judge0StatusHandler
{
    protected override int HandledStatusId => (int)Judge0Status.TimeLimitExceeded;

    protected override string GetErrorMessage(SubmissionContext context)
    {
        return "O código excedeu o limite de tempo de execução.";
    }
}