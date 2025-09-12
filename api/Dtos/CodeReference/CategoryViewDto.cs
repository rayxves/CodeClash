
namespace Dtos;

public class CategoryViewDto
{
    public CodeReferenceDto? CurrentCategory { get; set; }
    public List<CodeReferenceDto> Children { get; set; } = new();
    public List<CodeReferenceDto> Breadcrumbs { get; set; } = new();
}