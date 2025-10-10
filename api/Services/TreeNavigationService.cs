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

        IIterator<CodeComponent> baseIterator = root.CreateIterator(mode);

        while (baseIterator.HasNext())
        {
            if (baseIterator.Next().Id == currentId)
            {
                break;
            }
        }

        if (mode.ToLower() == "algorithms")
        {
            while (baseIterator.HasNext())
            {
                var nextNode = baseIterator.Next();
                if (!nextNode.IsComposite())
                {
                    return nextNode;
                }
            }
        }
        else
        {
            if (baseIterator.HasNext())
            {
                return baseIterator.Next();
            }
        }

        return null;
    }
}