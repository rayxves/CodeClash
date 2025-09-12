using Builders;
using Dtos;


namespace Interfaces;

public interface IJudge0Services
{
     Task<Judge0Response> SubmitAsync(SubmissionRequest request);
}