using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Dtos;
using Xunit;

namespace api.IntegrationTests.Controllers;

public class UserControllerTest : BaseIntegrationTest
{
    public UserControllerTest(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task RegisterUser_ShouldReturnOk_WithValidData()
    {
        var registerDto = new UserRegisterDto
        {
            UserName = $"testuser_{Guid.NewGuid()}",
            Email = $"test_{Guid.NewGuid()}@test.com",
            Password = "Test@123",
            ConfirmPassword = "Test@123"
        };

        var response = await Client.PostAsJsonAsync("/api/users/register", registerDto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<UserDto>();
        Assert.NotNull(result);
        Assert.Equal(registerDto.UserName, result.Username);
        Assert.NotEmpty(result.Token);
        Assert.Equal(0, result.TotalPoints);
    }

    [Fact]
    public async Task RegisterUser_ShouldReturnBadRequest_WithDuplicateUsername()
    {
        var username = $"duplicate_{Guid.NewGuid()}";
        var registerDto = new UserRegisterDto
        {
            UserName = username,
            Email = $"{username}@test.com",
            Password = "Test@123",
            ConfirmPassword = "Test@123"
        };
        await Client.PostAsJsonAsync("/api/users/register", registerDto);

        var response = await Client.PostAsJsonAsync("/api/users/register", registerDto);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task RegisterUser_ShouldReturnBadRequest_WithInvalidEmail()
    {
        var registerDto = new UserRegisterDto

        {
            UserName = $"user_{Guid.NewGuid()}",
            Email = "invalid-email",
            Password = "Test@123",
            ConfirmPassword = "Test@123"
        };

        var response = await Client.PostAsJsonAsync("/api/users/register", registerDto);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task LoginUser_ShouldReturnBadRequest_WithInvalidUsername()
    {
        var loginDto = new UserLoginDto

        {
            UserName = "nonexistent",
            Password = "Test@123"
        };

        var response = await Client.PostAsJsonAsync("/api/users/login", loginDto);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

    }



    [Fact]
    public async Task LoginUser_ShouldReturnBadRequest_WithInvalidPassword()
    {
        var username = $"user_{Guid.NewGuid()}";
        var registerDto = new UserRegisterDto

        {
            UserName = username,
            Email = $"{username}@test.com",
            Password = "Test@123",
            ConfirmPassword = "Test@123"
        };

        await Client.PostAsJsonAsync("/api/users/register", registerDto);
        var loginDto = new UserLoginDto
        {
            UserName = username,
            Password = "WrongPassword"
        };
        var response = await Client.PostAsJsonAsync("/api/users/login", loginDto);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetUser_ShouldReturnUnauthorized_WithoutToken()
    {
        var response = await Client.GetAsync("/api/users/get-user");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }




    [Fact]
    public async Task GetUser_ShouldReturnOk_WithValidToken()
    {
        var (token, username, _) = await Factory.CreateAndLoginUser();
        var client = Factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/users/get-user");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<UserDto>();
        Assert.NotNull(result);
        Assert.Equal(username, result.Username);
    }

    [Fact]
    public async Task GetCompleteProfile_ShouldReturnOk_WithValidToken()
    {
        var (token, username, _) = await Factory.CreateAndLoginUser();
        var client = Factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/users/profile/complete");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains(username, content);
    }

    [Fact]
    public async Task GetCompleteProfile_ShouldIncludeSolutions()
    {
        var (token, username, userId) = await Factory.CreateAndLoginUser();
        var problemId = await Factory.SeedProblem();
        await Factory.SeedUserSolution(userId, problemId, isApproved: true);

        var client = Factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/users/profile/complete");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("solutions", content.ToLower());
    }
}