using Microsoft.AspNetCore.Mvc;
using Services;
using Models;
using Dtos;
using Data;
using Microsoft.EntityFrameworkCore;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class CodeController : ControllerBase
{
    private readonly CodeSubmissionFacade _submissionFacade;
    private readonly ApplicationDbContext _context;


    public CodeController(CodeSubmissionFacade submissionFacade, ApplicationDbContext context)
    {
        _submissionFacade = submissionFacade;
        _context = context;
    }

    [HttpPost("submit")]
    public async Task<ActionResult<SubmissionResult>> SubmitCode([FromBody] SubmissionRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _submissionFacade.ProcessSubmissionAsync(request);

        if (result.Status == "Error")
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("direct")]
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
        var reference = await _context.CodeReferences
            .Include(r => r.Children)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reference == null)
            return NotFound();

        return Ok(reference);
    }

}
