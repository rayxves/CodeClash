using Microsoft.AspNetCore.Mvc;
using Interfaces;
using Dtos;
using Facades;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Controllers;

[ApiController]
[Route("api/code")]
public class CodeController : ControllerBase
{
    private readonly ICodeReferenceServices _codeService;
    private readonly ISubmissionFacade _submissionFacade;

    public CodeController(ICodeReferenceServices codeService, ISubmissionFacade submissionFacade)
    {
        _codeService = codeService;
        _submissionFacade = submissionFacade;
    }

    [Authorize]
    [HttpPost("submit")]
    public async Task<ActionResult<Judge0Response>> SubmitDirect([FromBody] SubmissionRequestDto dto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId?.Value))
            {
                return Unauthorized("Usuário não autenticado.");
            }

            var response = await _submissionFacade.SubmitCodeAsync(dto.Code, dto.Language, dto.ProblemId, userId.Value);
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
        try
        {
            var references = await _codeService.SearchAsync(language, category, name);
            return Ok(references);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }

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

    [HttpGet("view/{language}/{categoryName?}")]
    public async Task<IActionResult> GetCategoryView(string language, string? categoryName = null)
    {

        var result = await _codeService.GetCategoryViewAsync(language, categoryName);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}