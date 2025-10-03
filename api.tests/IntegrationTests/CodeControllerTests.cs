using System.Net;
using System.Net.Http.Json;
using Dtos;
using Xunit;
using api.IntegrationTests;

namespace IntegrationTests.Controllers;

public class CodeControllerTests : BaseIntegrationTest
{
    public CodeControllerTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetTreeByLanguage_ShouldReturnOk_WithValidLanguage()
    {
        await Factory.SeedCodeReference("Python");
        var response = await Client.GetAsync("/api/code/tree?language=Python");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var tree = await response.Content.ReadFromJsonAsync<CodeComponentDto>();
        Assert.NotNull(tree);
    }

    [Fact]
    public async Task GetTreeByLanguage_ShouldReturnNotFound_WithInvalidLanguage()
    {
        var response = await Client.GetAsync("/api/code/tree?language=InvalidLanguage");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Search_ShouldReturnResults_WhenNameMatches()
    {
        await Factory.SeedCodeReference(name: "Bubble Sort");
        var response = await Client.GetAsync("/api/code/search?name=Bubble");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("Bubble", content);
    }

    [Fact]
    public async Task GetById_ShouldReturnOk_WhenExists()
    {
        var id = await Factory.SeedCodeReference();
        var response = await Client.GetAsync($"/api/code/{id}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotEmpty(content);
    }
}