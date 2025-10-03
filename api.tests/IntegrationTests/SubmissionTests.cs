using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Dtos;
using Xunit;
using api.IntegrationTests;

namespace IntegrationTests.Controllers;

public class SubmissionTests : BaseIntegrationTest
{
    public SubmissionTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task SubmitDirect_ShouldReturnUnauthorized_WithoutToken()
    {
        var dto = new SubmissionRequestDto { Code = "print('Hello')", Language = "Python" };
        var response = await Client.PostAsJsonAsync("/api/code/submit", dto);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task SubmitDirect_ShouldAcceptValidToken()
    {
        var (token, _, _) = await Factory.CreateAndLoginUser();
        var client = Factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var dto = new SubmissionRequestDto { Code = "print('Hello World')", Language = "Python" };
        var response = await client.PostAsJsonAsync("/api/code/submit", dto);
        Assert.True(response.IsSuccessStatusCode);
    }

    [Fact]
    public async Task SubmitDirect_ShouldReturnBadRequest_WithNonExistentProblemId()
    {
        var (token, _, _) = await Factory.CreateAndLoginUser();
        var client = Factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var dto = new SubmissionRequestDto { Code = "print('test')", Language = "Python", ProblemId = 99999 };
        var response = await client.PostAsJsonAsync("/api/code/submit", dto);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}