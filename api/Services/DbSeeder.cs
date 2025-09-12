using System.Text.Json;
using Data;
using Microsoft.EntityFrameworkCore;
using Models;
using Composites;
using Dtos;

namespace Services;

public static class DbSeeder
{
    public static async Task SeedCodeReferenceAsync(ApplicationDbContext context)
    {
        if (await context.CodeReferences.AnyAsync())
        {
            return;
        }

        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var filePath = Path.Combine(baseDir, "code.json");
        var jsonData = await File.ReadAllTextAsync(filePath);
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var seedData = JsonSerializer.Deserialize<List<CodeReferenceSeedDto>>(jsonData, options);

        if (seedData == null || !seedData.Any()) return;

        var componentMap = new Dictionary<int, (CodeComponent component, int? parentId)>();
        var rootComponents = new List<CodeComponent>();

        foreach (var dto in seedData)
        {
            CodeComponent component = string.IsNullOrEmpty(dto.Code)
                ? new CodeCategory(dto)
                : new CodeAlgorithm(dto);

            componentMap.Add(dto.Id, (component, dto.ParentId));
        }

        foreach (var (id, (component, parentId)) in componentMap)
        {
            if (parentId.HasValue)
            {
                if (componentMap.TryGetValue(parentId.Value, out var parentTuple))
                {
                    parentTuple.component.Add(component);
                }
            }
            else
            {
                rootComponents.Add(component);
            }
        }

        var topLevelEntities = rootComponents.Select(ConvertToEntity).ToList();

        try
        {
            await context.CodeReferences.AddRangeAsync(topLevelEntities);
            await context.SaveChangesAsync();
        }
        catch (Exception)
        {
            throw;
        }
    }

    private static CodeReferenceEntity ConvertToEntity(CodeComponent component)
    {
        var entity = new CodeReferenceEntity
        {
            Name = component.Name,
            Category = component.Category,
            Language = component.Language,
            Description = component.Description,
        };

        if (component is CodeAlgorithm algorithm)
        {
            entity.Code = algorithm.Code;
        }
        else if (component is CodeCategory)
        {
            entity.Children = component.GetChildren().Select(ConvertToEntity).ToList();
        }

        return entity;
    }

    public static async Task SeedProblemsAsync(ApplicationDbContext context)
    {
        if (await context.Problems.AnyAsync())
        {
            return;
        }

        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var filePath = Path.Combine(baseDir, "problems.json");

        if (!File.Exists(filePath))
        {
            return;
        }

        var jsonData = await File.ReadAllTextAsync(filePath);
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var seedData = JsonSerializer.Deserialize<List<Problem>>(jsonData, options);

        if (seedData == null || !seedData.Any()) return;

        try
        {
            await context.Problems.AddRangeAsync(seedData);
            await context.SaveChangesAsync();
        }
        catch (Exception)
        {
            throw;
        }
    }
}