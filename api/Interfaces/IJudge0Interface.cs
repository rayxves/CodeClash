using Dtos;
using Models;

namespace Interfaces;

public interface IJudge0Interface
{
     Task<Judge0Response> SubmitAsync(SubmissionRequest request);
    Task<Judge0Response> GetSubmissionAsync(string token);
}