using System.Net;
using System.Net.Http.Json;
using Dtos;
using Xunit;
using api.IntegrationTests;

namespace IntegrationTests.Controllers;

public class TreeNavigationTests : BaseIntegrationTest
{
    public TreeNavigationTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetNextNode_ShouldReturnOk_WhenNextNodeExists()
    {
        var firstId = await Factory.SeedCodeReference("Python", "Category A", "Node 1");
        await Factory.SeedCodeReference("Python", "Category A", "Node 2");

        var response = await Client.GetAsync($"/api/tree-navigation/next-node?language=Python&mode=depth&currentId={firstId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetNextNode_ShouldReturnNoContent_WhenNoMoreNodes()
    {
        var id = await Factory.SeedCodeReference("Python");

        var response = await Client.GetAsync($"/api/tree-navigation/next-node?language=Python&mode=depth&currentId={id + 1000}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task GetNextNode_ShouldReturnCodeComponentDto_WhenNodeExists()
    {
        await Factory.SeedCodeReference("Python", "Category A", "Node 1");

        var response = await Client.GetAsync($"/api/tree-navigation/next-node?language=Python&mode=depth&currentId=0");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var node = await response.Content.ReadFromJsonAsync<CodeComponentDto>();
        Assert.NotNull(node);
    }
}