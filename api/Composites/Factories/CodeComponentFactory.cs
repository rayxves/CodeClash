using Dtos;
using Models;

namespace Composites;

public class CodeComponentFactory : ICodeComponentFactory
{
    public CodeComponent CreateComponent(CodeReferenceSeedDto dto)
    {
        return string.IsNullOrEmpty(dto.Code)
            ? new CodeCategory(dto)
            : new CodeAlgorithm(dto);
    }

    public CodeComponent CreateComponent(CodeReferenceEntity entity)
    {
        return string.IsNullOrEmpty(entity.Code)
            ? new CodeCategory(entity)
            : new CodeAlgorithm(entity);
    }
}