using Microsoft.AspNetCore.Mvc;
using Services;
using Models;
using Dtos;
using Interfaces;
using Composites;

namespace Controllers;

[ApiController]
[Route("api/code")]
public class CodeController : ControllerBase
{
    private readonly ICodeReferenceInterface _codeService;
    private readonly CodeSubmissionFacade _submissionFacade;

    public CodeController(ICodeReferenceInterface codeService, CodeSubmissionFacade submissionFacade)
    {
        _codeService = codeService;
        _submissionFacade = submissionFacade;
    }

    [HttpPost("submit")]
    public async Task<ActionResult<Judge0Response>> SubmitDirect(
        [FromBody] SubmissionRequestDto dto)
    {
        try
        {
            var response = await _submissionFacade.SubmitCodeAsync(dto.Code, dto.Input, dto.Language);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetReferenceWithChildren(int id)
    {
        var tree = await _codeService.BuildCompositeTreeAsync(id);
        var root = tree.Children.FirstOrDefault() as CodeReferenceComposite;

        if (root == null)
            return NotFound();

        return Ok(root.ToCardWithChildren());
    }

    [HttpGet("by-language/{language}")]
    public async Task<IActionResult> GetReferencesByLanguage(string language)
    {
        var references = await _codeService.GetByLanguageAsync(language);
        return Ok(references);
    }

    [HttpGet("by-category/{category}")]
    public async Task<IActionResult> GetReferencesByCategory(string category)
    {
        var references = await _codeService.GetByCategoryAsync(category);
        return Ok(references);
    }

    [HttpGet("by-name/{name}")]
    public async Task<IActionResult> GetReferencesByName(string name)
    {
        var references = await _codeService.SearchByNameAsync(name);
        return Ok(references);
    }

    [HttpPost("recommend-similar")]
    public async Task<IActionResult> RecommendSimilar([FromBody] RecommendSimilarDto dto)
    {
        try
        {
            var recommendations = await _codeService.RecommendSimilarAsync(dto.UserCodeAttempt);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}