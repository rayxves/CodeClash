using Models;

namespace Validators;

public class SuccessHandler : SubmissionHandlerBase
{
    protected override Task<bool> CanHandleAsync(SubmissionContext context) =>
        Task.FromResult(context.Response?.Status?.Id == 3);

    protected override Task ProcessAsync(SubmissionContext context)
    {
        Console.WriteLine($"[DEBUG] Status ID: {context.Response?.Status?.Id}");
        Console.WriteLine($"[DEBUG] Stdout: {context.Response?.Stdout}");
        Console.WriteLine($"[DEBUG] Stderr: {context.Response?.Stderr}");
        Console.WriteLine($"[DEBUG] CompileOutput: {context.Response?.CompileOutput}");
        context.ErrorMessage = null; 
        context.IsCompleted = true;
        return Task.CompletedTask;
    }
}
