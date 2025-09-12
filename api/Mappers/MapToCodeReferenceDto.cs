using Models;
using Dtos;

namespace Mappers;

public static class MappingExtensions
{
    public static CodeReferenceDto ToDto(this CodeReferenceEntity entity)
    {
        return new CodeReferenceDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Category = entity.Category,
            Language = entity.Language,
            Code = entity.Code,
            Description = entity.Description,
            ParentId = entity.ParentId
        };
    }
}