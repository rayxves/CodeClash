using Interfaces;

namespace SubmissionChain;

public interface ISubmissionChainFactory
{
    ISubmissionHandler Create(IJudge0Services judge0Service);
}