using Composites;

namespace Interfaces;

public interface ITreeNavigationService
{
    Task<CodeComponent?> GetNextNodeAsync(string language, string mode, int currentId);
}