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

        if (tree == null)
            return NotFound();

        if (tree is CodeReferenceComposite composite)
            return Ok(composite.ToCardWithChildren());

        return Ok(tree.ToCardModel());
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

    [HttpGet("by-language-and-category")]
    public async Task<IActionResult> GetByLanguageAndCategory([FromQuery] string language, [FromQuery] string category)
    {
        var references = await _codeService.GetByLanguageAndCategoryAsync(language, category);
        return Ok(references);
    }

    [HttpGet("by-language-and-name")]
    public async Task<IActionResult> GetByLanguageAndName([FromQuery] string language, [FromQuery] string name)
    {
        var references = await _codeService.GetByLanguageAndNameAsync(language, name);
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

    [HttpGet("flattened-references")]
    public async Task<IActionResult> GetFlattenedReferences(string? language = null, string? category = null, string? name = null, int? maxDepth = null)
    {
        var references = await _codeService.GetFlattenedReferencesAsync(language, category, name, maxDepth);
        return Ok(references);
    }

    [HttpGet("references-depth")]
    public async Task<IActionResult> GetReferencesDepth(string? category = null, string? name = null)
    {
        var depth = await _codeService.GetReferencesDepthAsync(category, name);
        return Ok(new { Depth = depth });
    }

}