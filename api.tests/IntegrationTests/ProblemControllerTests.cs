using System.Net;
using System.Net.Http.Json;
using Models;
using Xunit;
using api.IntegrationTests;

namespace IntegrationTests.Controllers;

public class ProblemControllerTests : BaseIntegrationTest
{
    public ProblemControllerTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetAllProblems_ShouldReturnOk()
    {
        await Factory.SeedProblem();
        var response = await Client.GetAsync("/api/problems");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var problems = await response.Content.ReadFromJsonAsync<List<Problem>>();
        Assert.NotNull(problems);
        Assert.NotEmpty(problems);
    }

    [Fact]
    public async Task GetProblemById_ShouldReturnOk_WhenExists()
    {
        var problemId = await Factory.SeedProblem();
        var response = await Client.GetAsync($"/api/problems/{problemId}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<Problem>();
        Assert.NotNull(problem);
        Assert.Equal(problemId, problem.Id);
    }

    [Fact]
    public async Task GetProblemsByFilter_ShouldReturnFiltered_ByDifficulty()
    {
        await Factory.SeedProblem(difficulty: "Fácil");
        await Factory.SeedProblem(difficulty: "Médio");
        var response = await Client.GetAsync("/api/problems/filter?difficulty=fácil");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var problems = await response.Content.ReadFromJsonAsync<List<Problem>>();
        Assert.NotNull(problems);
        Assert.All(problems, p => Assert.Equal("Fácil", p.Difficulty));
    }
}