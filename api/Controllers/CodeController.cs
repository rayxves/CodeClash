using Microsoft.AspNetCore.Mvc;
using Interfaces;
using Dtos;
using Composites;
using Services;
using Facades;

namespace Controllers;

[ApiController]
[Route("api/code")]
public class CodeController : ControllerBase
{
    private readonly ICodeReferenceServices _codeService;
    private readonly SubmissionFacade _submissionFacade;

    public CodeController(ICodeReferenceServices codeService, SubmissionFacade submissionFacade)
    {
        _codeService = codeService;
        _submissionFacade = submissionFacade;
    }

    [HttpPost("submit")]
    public async Task<ActionResult<Judge0Response>> SubmitDirect([FromBody] SubmissionRequestDto dto, int? problemId)
    {
        try
        {
            var response = await _submissionFacade.SubmitCodeAsync(dto.Code, dto.Language, problemId.HasValue ? problemId : null);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var reference = await _codeService.GetByIdAsync(id);
        if (reference == null)
        {
            return NotFound();
        }
        return Ok(reference);
    }

    [HttpGet("tree/{language}")]
    public async Task<IActionResult> GetTreeByLanguage(string language)
    {
        var tree = await _codeService.BuildTreeForLanguageAsync(language);
        if (tree == null)
        {
            return NotFound($"Nenhuma árvore encontrada para a linguagem '{language}'.");
        }

        return Ok(tree);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? language, [FromQuery] string? category, [FromQuery] string? name)
    {
        var references = await _codeService.SearchAsync(language, category, name);
        return Ok(references);
    }

    [HttpPost("recommend-similar")]
    public async Task<IActionResult> RecommendSimilar([FromBody] RecommendSimilarDto dto)
    {
        var recommendations = await _codeService.RecommendSimilarAsync(dto.UserCodeAttempt);
        return Ok(recommendations);
    }
}