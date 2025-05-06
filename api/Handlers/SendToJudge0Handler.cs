using Models;
using Interfaces;

namespace Validators;

public class SendToJudge0Handler : SubmissionHandlerBase
{
    private readonly IJudge0Interface _judge0Client;

    public SendToJudge0Handler(IJudge0Interface judge0Client)
    {
        _judge0Client = judge0Client;
    }

    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response == null && string.IsNullOrEmpty(context.ErrorMessage));

    protected override async Task ProcessAsync(SubmissionContext context)
    {
        try
        {
            context.Response = await _judge0Client.SubmitAsync(context.Request);
        }
        catch (Exception ex)
        {
            context.ErrorMessage = SubmissionErrorMessages.SendFail(ex.Message);
            context.IsCompleted = true;
        }
    }
}
