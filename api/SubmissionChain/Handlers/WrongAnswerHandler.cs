using Dtos;

namespace SubmissionChain.Handlers;

public class WrongAnswerHandler : Judge0StatusHandler
{
    protected override int HandledStatusId => (int)Judge0Status.WrongAnswer;

    protected override string GetErrorMessage(SubmissionContext context)
    {
        return "A solução foi executada com sucesso, mas a resposta está incorreta.";
    }
}