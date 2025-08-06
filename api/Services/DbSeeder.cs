using System.Text.Json;
using Data;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;

public static class DbSeeder
{
    private class CodeReferenceSeedDto
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public static async Task SeedDatabaseAsync(ApplicationDbContext context)
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

        if (seedData == null || !seedData.Any())
        {
            return;
        }

        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var categories = seedData.GroupBy(s => s.Category);

            foreach (var group in categories)
            {
                var parentDto = group.Single(item => item.ParentId == null);
                var parentEntity = new CodeReferenceEntity
                {
                    Name = parentDto.Name,
                    Category = parentDto.Category,
                    Language = parentDto.Language,
                    Code = parentDto.Code,
                    Description = parentDto.Description,
                    ParentId = null
                };

                context.CodeReferences.Add(parentEntity);
                await context.SaveChangesAsync();


                var childrenEntities = group
                    .Where(item => item.ParentId != null)
                    .Select(childDto => new CodeReferenceEntity
                    {
                        Name = childDto.Name,
                        Category = childDto.Category,
                        Language = childDto.Language,
                        Code = childDto.Code,
                        Description = childDto.Description,
                        ParentId = parentEntity.Id
                    }).ToList();

                await context.CodeReferences.AddRangeAsync(childrenEntities);
            }

            await context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"An error occurred during database seeding: {ex.Message}");
            throw;
        }
    }
}