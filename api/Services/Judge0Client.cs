using Builders;
using Dtos;
using Interfaces;
using Microsoft.Extensions.Options;
using Models;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

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
        try
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (string.IsNullOrWhiteSpace(request.Code)) throw new ArgumentException("Código fonte vazio");

            var payload = new
            {
                source_code = Base64Encode(request.Code),
                language_id = request.LanguageId,
                stdin = Base64Encode(request.Input ?? string.Empty),
                base64_encoded = true
            };

            var response = await _httpClient.PostAsJsonAsync(
                "submissions?wait=true&base64_encoded=true",
                payload);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Erro Judge0: {response.StatusCode} - {errorContent}");
            }

            var result = await response.Content.ReadFromJsonAsync<Judge0Response>();
            return DecodeResponse(result);
        }
        catch (Exception ex)
        {
            throw new Exception("Falha na submissão", ex);
        }
    }

    private string Base64Encode(string plainText)
    {
        if (string.IsNullOrEmpty(plainText)) return string.Empty;
        var bytes = Encoding.UTF8.GetBytes(plainText);
        return Convert.ToBase64String(bytes);
    }

    private Judge0Response DecodeResponse(Judge0Response response)
    {
        if (response == null) return null;

        response.Stdout = Base64Decode(response.Stdout);
        response.Stderr = Base64Decode(response.Stderr);
        response.CompileOutput = Base64Decode(response.CompileOutput);
        response.Message = Base64Decode(response.Message);

        return response;
    }

    private string Base64Decode(string base64Text)
    {
        if (string.IsNullOrEmpty(base64Text)) return string.Empty;
        var bytes = Convert.FromBase64String(base64Text);
        return Encoding.UTF8.GetString(bytes);
    }

}