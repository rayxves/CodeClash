using Composites;
using Iterators;
using Models;
using Xunit;

namespace IntegrationTests.Patterns;

public class IteratorPatternTests
{
    private CodeComponent CreateSampleTree()
    {
        var root = new CodeCategory(new CodeReferenceEntity { Id = 1, Name = "Root", Category = "Root", Language = "Python", Description = "Root category" });
        var category1 = new CodeCategory(new CodeReferenceEntity { Id = 2, Name = "Category1", Category = "Root", Language = "Python", Description = "Category 1" });
        var algorithm1 = new CodeAlgorithm(new CodeReferenceEntity { Id = 3, Name = "Algorithm1", Category = "Category1", Language = "Python", Code = "def algo1(): pass", Description = "Algorithm 1" });
        var algorithm2 = new CodeAlgorithm(new CodeReferenceEntity { Id = 4, Name = "Algorithm2", Category = "Category1", Language = "Python", Code = "def algo2(): pass", Description = "Algorithm 2" });
        root.Add(category1);
        category1.Add(algorithm1);
        category1.Add(algorithm2);
        return root;
    }

    [Fact]
    public void DepthFirstIterator_ShouldIterateInDepthFirstOrder()
    {
        var root = CreateSampleTree();
        var iterator = new DepthFirstIterator(root);
        var order = new List<string>();
        while (iterator.HasNext())
        {
            order.Add(iterator.Next().Name);
        }
        Assert.Equal("Root", order[0]);
        Assert.Equal("Category1", order[1]);
    }

    [Fact]
    public void DepthFirstIterator_ShouldIterateAllNodes()
    {
        var root = CreateSampleTree();
        var iterator = new DepthFirstIterator(root);
        var count = 0;
        while (iterator.HasNext())
        {
            iterator.Next();
            count++;
        }
        Assert.True(count >= 3);
    }
}