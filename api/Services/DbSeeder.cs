using System.Text.Json;
using Data;
using Microsoft.EntityFrameworkCore;
using Models;
using Composites; 

namespace Services;

public static class DbSeeder
{
    public class CodeReferenceSeedDto
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public static async Task SeedCodeReferenceAsync(ApplicationDbContext context)
    {
        if (await context.CodeReferences.AnyAsync())
        {
            Console.WriteLine("O banco de dados já contém dados. Seeding ignorado.");
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

        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            await context.CodeReferences.AddRangeAsync(topLevelEntities);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();
            Console.WriteLine("✅ Seeding concluído com sucesso.");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"❌ Ocorreu um erro durante o seeding: {ex.Message}");
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
            Console.WriteLine("O banco de dados já contém problemas. O seeding foi ignorado.");
            return;
        }

        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var filePath = Path.Combine(baseDir, "problems.json");

        if (!File.Exists(filePath))
        {
            Console.WriteLine($"Arquivo de seed não encontrado em: {filePath}");
            return;
        }

        var jsonData = await File.ReadAllTextAsync(filePath);
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var seedData = JsonSerializer.Deserialize<List<Problem>>(jsonData, options);

        if (seedData == null || !seedData.Any()) return;

        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            await context.Problems.AddRangeAsync(seedData);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();
            Console.WriteLine("✅ Seeding de problemas concluído com sucesso.");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"❌ Ocorreu um erro durante o seeding de problemas: {ex.Message}");
            throw;
        }
    }
}