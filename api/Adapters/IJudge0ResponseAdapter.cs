using Dtos;
using Models;

namespace Adapters;

public interface IJudge0ResponseAdapter
{
    TestCaseResultDto AdaptToTestResult(Judge0Response response, TestCase testCase);
    SubmissionResultDto AdaptToSimpleSubmissionResult(Judge0Response response);
}