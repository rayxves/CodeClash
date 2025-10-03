using System.Net.Http.Json;
using Data;
using Dtos;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Models;
using Testcontainers.PostgreSql;
using Xunit;

namespace api.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer;

    public CustomWebApplicationFactory()
    {
        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.Test.json")
            .Build();

        var containerConfig = config.GetSection("TestDatabaseContainer");

        _dbContainer = new PostgreSqlBuilder()
            .WithImage(containerConfig["Image"])
            .WithDatabase(containerConfig["Database"])
            .WithUsername(containerConfig["Username"])
            .WithPassword(containerConfig["Password"])
            .Build();
    }

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _dbContainer.StopAsync();
    }


    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices((builderContext, services) =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContextPool<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(_dbContainer.GetConnectionString());
            });

            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            db.Database.EnsureCreated();
        });
    }

    public async Task<(string token, string username, string userId)> CreateAndLoginUser()
    {
        var username = $"user_{Guid.NewGuid()}";
        var password = "Test@123";

        var registerDto = new UserRegisterDto
        {
            UserName = username,
            Email = $"{username}@test.com",
            Password = password,
            ConfirmPassword = password
        };

        using var client = CreateClient();
        var registerResponse = await client.PostAsJsonAsync("/api/users/register", registerDto);
        registerResponse.EnsureSuccessStatusCode();
        var userDto = await registerResponse.Content.ReadFromJsonAsync<UserDto>();

        return (userDto!.Token, username, userDto.Id);
    }

    public async Task<int> SeedProblem(string title = "Test Problem", string difficulty = "Fácil", string category = "Arrays")
    {
        using var scope = this.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var problem = new Problem
        {
            Title = title,
            Description = "Test description",
            Difficulty = difficulty,
            Category = category,
            TestCases =
            [
                new TestCase
                {
                    Input = "2\n3",
                    ExpectedOutput = "5",
                    isHidden = false,
                    Order = 1
                },
                new TestCase
                {
                    Input = "10\n20",
                    ExpectedOutput = "30",
                    isHidden = true,
                    Order = 2
                }
            ]
        };

        context.Problems.Add(problem);
        await context.SaveChangesAsync();
        return problem.Id;
    }

    public async Task<int> SeedCodeReference(string language = "Python", string category = "Sorting", string name = "Bubble Sort")
    {
        using var scope = this.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var reference = new CodeReferenceEntity
        {
            Name = name,
            Category = category,
            Language = language,
            Code = "def bubble_sort(arr): pass",
            Description = "Simple sorting algorithm"
        };

        context.CodeReferences.Add(reference);
        await context.SaveChangesAsync();
        return reference.Id;
    }

    public async Task<UserProblemSolution> SeedUserSolution(string userId, int problemId, bool isApproved = false)
    {
        using var scope = this.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var solution = new UserProblemSolution
        {
            UserId = userId,
            ProblemId = problemId,
            Language = "Python",
            Code = "print('test')",
            SolvedAt = DateTime.UtcNow,
            IsApproved = isApproved,
            PointsEarned = isApproved ? 10 : 0,
            MessageOutput = isApproved ? "Aprovado" : "Pendente"
        };

        context.UserProblemSolutions.Add(solution);
        await context.SaveChangesAsync();
        return solution;
    }
}