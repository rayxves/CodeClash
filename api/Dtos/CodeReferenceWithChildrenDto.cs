namespace Dtos;

public class CodeReferenceWithChildrenDto : CodeReferenceDto
{
    public List<CodeReferenceWithCodeDto> Children { get; set; } = new();
}