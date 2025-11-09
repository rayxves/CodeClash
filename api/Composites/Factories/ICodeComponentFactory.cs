using Dtos;
using Models;

namespace Composites;

public interface ICodeComponentFactory
{
    CodeComponent CreateComponent(CodeReferenceSeedDto dto);
    CodeComponent CreateComponent(CodeReferenceEntity entity);
}