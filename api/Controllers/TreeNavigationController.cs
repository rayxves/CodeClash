using Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Controllers;

[ApiController]
[Route("api/tree-navigation")]
public class TreeNavigationController : ControllerBase
{
    private readonly ITreeNavigationService _navigationService;
    private readonly ICodeReferenceServices _codeReferenceServices;


    public TreeNavigationController(ITreeNavigationService navigationService, ICodeReferenceServices codeReferenceServices)
    {
        _navigationService = navigationService;
        _codeReferenceServices = codeReferenceServices;
    }

    [HttpGet("next-node")]
    public async Task<IActionResult> GetNextNode([FromQuery] string language, [FromQuery] string mode, [FromQuery] int currentId)
    {
        var nextComponent = await _navigationService.GetNextNodeAsync(language, mode, currentId);

        if (nextComponent == null)
        {
            return Ok(null);
        }
        
        var nextNodeDto = _codeReferenceServices.MapComponentToDto(nextComponent);

        return Ok(nextNodeDto);
    }
}