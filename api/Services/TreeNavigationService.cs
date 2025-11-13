using Composites;
using Interfaces;
using Iterators;

namespace Services;

public class TreeNavigationService : ITreeNavigationService
{
    private readonly ICodeReferenceServices _codeReferenceService;

    public TreeNavigationService(ICodeReferenceServices codeReferenceService)
    {
        _codeReferenceService = codeReferenceService;
    }

    public async Task<CodeComponent?> GetNextNodeAsync(string language, string mode, int currentId)
    {
        var root = await _codeReferenceService.BuildTreeForLanguageAsync(language);
        if (root == null)
        {
            return null;
        }

        var iterator = root.CreateIterator(mode);

        var allNodes = new List<CodeComponent>();
        while (iterator.HasNext())
        {
            allNodes.Add(iterator.Next());
        }

        if (allNodes.Count == 0)
        {
            return null;
        }

        var currentIndex = allNodes.FindIndex(n => n.Id == currentId);


        if (currentIndex == -1)
        {
            return allNodes[0];
        }

        if (currentIndex + 1 < allNodes.Count)
        {
            return allNodes[currentIndex + 1];
        }

        return null;
    }
}