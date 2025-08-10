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
        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var filePath = Path.Combine(baseDir, "code.json");
        var jsonData = await File.ReadAllTextAsync(filePath);

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var seedData = JsonSerializer.Deserialize<List<CodeReferenceSeedDto>>(jsonData, options);

        if (seedData == null || !seedData.Any())
            return;

        await using var transaction = await context.Database.BeginTransactionAsync();

        try
        {
            // Agrupa por categoria + linguagem
            var categories = seedData.GroupBy(s => new { s.Category, s.Language });

            foreach (var group in categories)
            {
                var parents = group.Where(item => item.ParentId == null).ToList();

                if (parents.Count == 0)
                {
                    Console.WriteLine($"Nenhum pai encontrado para Categoria='{group.Key.Category}', Linguagem='{group.Key.Language}'");
                    continue;
                }

                if (parents.Count > 1)
                {
                    Console.WriteLine($"⚠ Mais de um pai encontrado para Categoria='{group.Key.Category}', Linguagem='{group.Key.Language}'");
                }

                var parentDto = parents.First();

                // Se já existe um pai igual no banco, pula
                if (await context.CodeReferences
                    .AnyAsync(c => c.Category == parentDto.Category && c.Language == parentDto.Language))
                {
                    continue;
                }

                // Salva o pai primeiro para obter o Id
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
                await context.SaveChangesAsync(); // Agora parentEntity.Id está preenchido

                // Cria e salva filhos com ParentId correto
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
                    })
                    .ToList();

                if (childrenEntities.Any())
                {
                    await context.CodeReferences.AddRangeAsync(childrenEntities);
                    await context.SaveChangesAsync();
                }
            }

            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"An error occurred during database seeding: {ex.Message}");
            throw;
        }
    }


    public static async Task SeedProblemsAsync(ApplicationDbContext context)
    {


        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var filePath = Path.Combine(baseDir, "problems.json");
        var jsonData = await File.ReadAllTextAsync(filePath);

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var seedData = JsonSerializer.Deserialize<List<Problem>>(jsonData, options);

        if (seedData == null || !seedData.Any())
        {
            return;
        }

        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            await context.Problems.AddRangeAsync(seedData);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"An error occurred during problems seeding: {ex.Message}");
            throw;
        }
    }

}