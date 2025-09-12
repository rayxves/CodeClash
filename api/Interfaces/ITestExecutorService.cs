using Dtos;
using Models;

namespace Interfaces;

public interface ITestExecutorService
{
    Task<List<TestCaseResultDto>> ExecuteTestsAsync(SubmissionStrategyInput input, IEnumerable<TestCase> testCases);
}
