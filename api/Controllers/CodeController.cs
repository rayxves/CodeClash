using Microsoft.AspNetCore.Mvc;
using Services;
using Models;
using Dtos;
using Data;
using Microsoft.EntityFrameworkCore;

namespace Controllers;

[ApiController]
[Route("api/code")]
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
         .Include(r => r.Parent)
         .Include(r => r.Children)
         .FirstOrDefaultAsync(r => r.Id == id);

        if (reference == null)
            return NotFound();

        var response = new CodeReferenceWithChildrenDto
        {
            Id = reference.Id,
            Name = reference.Name,
            Category = reference.Category,
            Language = reference.Language,
            Description = reference.Description,
            ParentName = reference.Parent?.Name,
            Children = reference.Children.Select(c => new CodeReferenceWithCodeDto
            {
                Id = c.Id,
                Name = c.Name,
                Category = c.Category,
                Language = c.Language,
                Description = c.Description,
                Code = c.Code
            }).ToList()
        };

        return Ok(response);
    }

    [HttpGet("by-category/{category}")]
    public async Task<ActionResult<List<CodeReferenceDto>>> GetReferencesByCategory(string category)
    {
        var references = await _context.CodeReferences
            .Where(r => r.Category == category)
            .Select(r => new CodeReferenceWithCodeDto
            {
                Id = r.Id,
                Name = r.Name,
                Category = r.Category,
                Language = r.Language,
                ParentName = r.Parent != null ? r.Parent.Name : null,
                Code = r.Code
            })
            .ToListAsync();

        return Ok(references);
    }

    [HttpGet("by-category/{category}")]
    public async Task<ActionResult<List<CodeReferenceWithCodeDto>>> GetReferencesByCategory(string category)
    {
        var references = await _context.CodeReferences
            .Where(r => r.Category == category)
            .Select(r => new CodeReferenceWithCodeDto
            {
                Id = r.Id,
                Name = r.Name,
                Category = r.Category,
                Language = r.Language,
                Description = r.Description,
                ParentName = r.Parent != null ? r.Parent.Name : null,
                Code = r.Code  // Inclui o código
            })
            .ToListAsync();

        return Ok(references);
    }

    [HttpGet("by-name/{name}")]
    public async Task<ActionResult<List<CodeReferenceWithCodeDto>>> GetReferencesByName(string name)
    {
        var references = await _context.CodeReferences
            .Where(r => r.Name.Contains(name))
            .Select(r => new CodeReferenceWithCodeDto
            {
                Id = r.Id,
                Name = r.Name,
                Category = r.Category,
                Language = r.Language,
                Description = r.Description,
                ParentName = r.Parent != null ? r.Parent.Name : null,
                Code = r.Code  
            })
            .ToListAsync();

        return Ok(references);
    }

}
