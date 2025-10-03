using Composites;
using Models;
using Xunit;

namespace IntegrationTests.Patterns;

public class CompositePatternTests
{
    [Fact]
    public void CodeAlgorithm_ShouldNotBeComposite()
    {
        var entity = new CodeReferenceEntity { Id = 1, Name = "Bubble Sort", Category = "Sorting", Language = "Python", Code = "def bubble_sort(): pass", Description = "Test" };
        var algorithm = new CodeAlgorithm(entity);
        Assert.False(algorithm.IsComposite());
    }

    [Fact]
    public void CodeCategory_ShouldBeComposite()
    {
        var entity = new CodeReferenceEntity { Id = 1, Name = "Sorting", Category = "Algorithms", Language = "Python", Description = "Test" };
        var category = new CodeCategory(entity);
        Assert.True(category.IsComposite());
    }

    [Fact]
    public void CodeCategory_ShouldAddChildren()
    {
        var categoryEntity = new CodeReferenceEntity { Id = 1, Name = "Sorting", Category = "Algorithms", Language = "Python", Description = "Test" };
        var algorithmEntity = new CodeReferenceEntity { Id = 2, Name = "Bubble Sort", Category = "Sorting", Language = "Python", Code = "def bubble_sort(): pass", Description = "Test" };
        var category = new CodeCategory(categoryEntity);
        var algorithm = new CodeAlgorithm(algorithmEntity);
        category.Add(algorithm);
        Assert.Single(category.GetChildren());
    }
}