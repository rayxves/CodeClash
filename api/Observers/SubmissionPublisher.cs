using Dtos;

namespace Observers;

public class SubmissionPublisher : ISubject
{
    private readonly IServiceProvider _serviceProvider;

    public SubmissionPublisher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    
    public async Task NotifyAsync(SubmissionSuccessContext context)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var observers = scope.ServiceProvider.GetServices<IObserver>();
            
            foreach (var observer in observers)
            {
                await observer.UpdateAsync(context);
            }
        }
    }
}