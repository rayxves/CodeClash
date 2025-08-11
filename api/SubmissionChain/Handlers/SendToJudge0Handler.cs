
using Interfaces;
using Dtos;

namespace SubmissionChain.Handlers;

public class SendToJudge0Handler : SubmissionHandler
{
    private readonly IJudge0Services _judge0Service;

    public SendToJudge0Handler(IJudge0Services judge0Service)
    {
        _judge0Service = judge0Service;
    }

    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response == null && string.IsNullOrEmpty(context.ErrorMessage));

    protected override async Task ProcessAsync(SubmissionContext context)
    {
        try
        {
            context.Response = await _judge0Service.SubmitAsync(context.Request);
        }
        catch (Exception ex)
        {
            context.ErrorMessage = $"Falha ao enviar submissão para o serviço de avaliação: {ex.Message}";
            context.IsCompleted = true;
        }
    }
}