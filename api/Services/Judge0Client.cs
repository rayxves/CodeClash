using Builders;
using Dtos;
using Interfaces;
using Microsoft.Extensions.Options;
using Models;
using System.Net.Http.Json;

namespace Services;

public class Judge0Client : IJudge0Interface
{
    private readonly HttpClient _httpClient;
    private readonly Judge0Settings _settings;

    public Judge0Client(HttpClient httpClient, IOptions<Judge0Settings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        ConfigureHttpClient();
    }

    private void ConfigureHttpClient()
    {
        _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", _settings.ApiKey);
        _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", _settings.ApiHost);
    }

    public async Task<Judge0Response> SubmitAsync(SubmissionRequest request)
    {
        var payload = new
        {
            source_code = request.Code,
            language_id = request.LanguageId,
            stdin = request.Input ?? string.Empty
        };


        var response = await _httpClient.PostAsJsonAsync(
            "submissions?wait=true&base64_encoded=false",
            payload);

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Judge0Response>();
    }

    public async Task<Judge0Response> GetSubmissionAsync(string token)
    {
        var response = await _httpClient.GetAsync($"submissions/{token}?base64_encoded=false");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Judge0Response>();
    }
}