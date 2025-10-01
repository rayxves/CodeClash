using Builders;
using Dtos;
using Interfaces;
using Microsoft.Extensions.Options;
using Models;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Services;

public class Judge0Services : IJudge0Services
{
    private readonly HttpClient _httpClient;
    private readonly Judge0Settings _settings;

    public Judge0Services(HttpClient httpClient, IOptions<Judge0Settings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _httpClient.Timeout = TimeSpan.FromMinutes(2);
        ConfigureHttpClient();
    }

    private void ConfigureHttpClient()
    {
        _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        _httpClient.DefaultRequestHeaders.Clear();

        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
    }

    public async Task<Judge0Response> SubmitAsync(SubmissionRequest request)
    {
        try
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (string.IsNullOrWhiteSpace(request.Code))
                throw new ArgumentException("Código fonte vazio");

            var payload = new
            {
                source_code = Convert.ToBase64String(Encoding.UTF8.GetBytes(request.Code)),
                language_id = request.LanguageId,
                stdin = !string.IsNullOrEmpty(request.Input)
        ? Convert.ToBase64String(Encoding.UTF8.GetBytes(request.Input))
        : null,
                expected_output = !string.IsNullOrEmpty(request.ExpectedOutput)
        ? Convert.ToBase64String(Encoding.UTF8.GetBytes(request.ExpectedOutput))
        : null
            };

            var serializerOptions = new JsonSerializerOptions
            {
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                WriteIndented = true
            };

            var jsonPayload = JsonSerializer.Serialize(payload, serializerOptions);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(
                "submissions?wait=true&base64_encoded=true",
                content
            );

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Erro Judge0: {response.StatusCode} - {errorContent}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<Judge0Response>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            result.Stdout = DecodeBase64(result.Stdout);
            result.Stderr = DecodeBase64(result.Stderr);
            result.CompileOutput = DecodeBase64(result.CompileOutput);
            result.Message = DecodeBase64(result.Message);

            return result;
        }
        catch (TaskCanceledException ex) when (ex.InnerException is TimeoutException)
        {
            throw new Exception("Timeout na submissão para Judge0", ex);
        }
        catch (HttpRequestException ex)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new Exception("Falha na submissão", ex);
        }
    }

    private string DecodeBase64(string base64EncodedData)
    {
        if (string.IsNullOrWhiteSpace(base64EncodedData))
            return string.Empty;

        try
        {
            var base64DecodedBytes = Convert.FromBase64String(base64EncodedData);
            return Encoding.UTF8.GetString(base64DecodedBytes);
        }
        catch
        {
            return "Erro ao decodificar Base64.";
        }
    }

    public async Task<bool> TestConnectionAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("languages");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
            }

            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            return false;
        }
    }

}