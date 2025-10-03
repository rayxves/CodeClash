using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Dtos;
using Models;
using Xunit;
using api.IntegrationTests;

namespace IntegrationTests.Controllers;

public class UserProblemSolutionTests : BaseIntegrationTest
{
    public UserProblemSolutionTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetAllUserProblemSolutions_ShouldReturnUnauthorized_WithoutToken()
    {
        var response = await Client.GetAsync("/api/user-problem-solutions/user");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetAllUserProblemSolutions_ShouldReturnUserSolutions()
    {
        var (token, _, userId) = await Factory.CreateAndLoginUser();
        var problemId = await Factory.SeedProblem();
        await Factory.SeedUserSolution(userId, problemId);
        var client = Factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await client.GetAsync("/api/user-problem-solutions/user");
        var solutions = await response.Content.ReadFromJsonAsync<List<UserProblemSolution>>();
        Assert.NotNull(solutions);
        Assert.NotEmpty(solutions);
        Assert.All(solutions, s => Assert.Equal(userId, s.UserId));
    }

    [Fact]
    public async Task GetUserProblemSolution_ShouldReturnOk_WhenExists()
    {
        var (token, _, userId) = await Factory.CreateAndLoginUser();
        var problemId = await Factory.SeedProblem();
        var solution = await Factory.SeedUserSolution(userId, problemId);
        var client = Factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await client.GetAsync($"/api/user-problem-solutions/{solution.Id}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var responseSolution = await response.Content.ReadFromJsonAsync<UserProblemSolution>();
        Assert.NotNull(responseSolution);
        Assert.Equal(solution.Id, responseSolution.Id);
    }

    [Fact]
    public async Task CreateUserProblemSolution_ShouldReturnOk_WithValidData()
    {
        var (token, _, userId) = await Factory.CreateAndLoginUser();
        var problemId = await Factory.SeedProblem();
        var client = Factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var dto = new UserProblemSolutionDto { ProblemId = problemId, Language = "Python", Code = "print('test')" };
        var response = await client.PostAsJsonAsync("/api/user-problem-solutions/new-solution", dto);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}