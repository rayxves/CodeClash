using Dtos;
using Models;

namespace SubmissionChain.Handlers;

public class UnprocessableEntityHandler : Judge0StatusHandler
{
    protected override int HandledStatusId => (int)Judge0Status.UnprocessableEntity;

    protected override string GetErrorMessage(SubmissionContext context)
    {
        return "Entidade não processável. Verifique o código ou a configuração do Judge0.";
    }
}