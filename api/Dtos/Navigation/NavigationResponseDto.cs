using Composites;

namespace Dtos;

public class NavigationResponseDto
{
    public CodeComponent? Current { get; set; }
    public bool HasNext { get; set; }
}