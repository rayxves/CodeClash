using Models;

namespace Validators;

public class TimeoutHandler : SubmissionHandlerBase
{
    protected override async Task<bool> CanHandleAsync(SubmissionContext context)
    {
        return context.Response?.Status?.Id == 5; 
    }

    protected override async Task ProcessAsync(SubmissionContext context)
    {
        context.ErrorMessage = "Tempo limite excedido. Otimize seu código!";
        context.IsCompleted = true;
    }
}