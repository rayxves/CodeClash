using Data;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace api.IntegrationTests;

public abstract class BaseIntegrationTest : IClassFixture<CustomWebApplicationFactory>, IDisposable
{
    private readonly IServiceScope _scope;
    protected readonly CustomWebApplicationFactory Factory;
    protected readonly ApplicationDbContext Context;
    protected readonly HttpClient Client;
    private readonly IDbContextTransaction _transaction;

    protected BaseIntegrationTest(CustomWebApplicationFactory factory)
    {
        Factory = factory;

        _scope = factory.Services.CreateScope();
        Context = _scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Client = factory.CreateClient();
        _transaction = Context.Database.BeginTransaction();
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        Context.Dispose();
        _scope.Dispose();
        Client.Dispose();
        GC.SuppressFinalize(this);
    }
}