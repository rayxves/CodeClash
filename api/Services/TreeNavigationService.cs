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

        Predicate<CodeComponent> filter;
        if (mode.ToLower() == "algorithms")
        {
            filter = (component) => !component.IsComposite();
        }
        else
        {
            filter = (component) => true;
        }


        IIterator<CodeComponent> baseIterator;
        if (mode.ToLower() == "breadth")
        {
            baseIterator = new BreadthFirstIterator(root);
        }
        else
        {
            baseIterator = new DepthFirstIterator(root);
        }

        while (baseIterator.HasNext())
        {
            var node = baseIterator.Next();
            if (node.Id == currentId)
            {
                break;
            }
        }

        while (baseIterator.HasNext())
        {
            var nextNode = baseIterator.Next();

            if (filter(nextNode))
            {
                return nextNode;
            }

        }

        return null;
    }
}