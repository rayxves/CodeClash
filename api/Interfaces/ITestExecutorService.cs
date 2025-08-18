using Dtos;
using Models;
using Strategies;

namespace Interfaces;

public interface ITestExecutorService
{
    Task<List<TestCaseResultDto>> ExecuteTestsAsync(SubmissionStrategyInput input, IEnumerable<TestCase> testCases);
}
