using Models;

namespace Validators;

public class SuccessHandler : SubmissionHandlerBase
{
    protected override async Task<bool> CanHandleAsync(SubmissionContext context)
    {
        return context.Response?.Status?.Id == 3; 
    }

    protected override async Task ProcessAsync(SubmissionContext context)
    {
        context.IsCompleted = true;
    }
}