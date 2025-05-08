using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class CodeReferenceEntity : CodeReference
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int? ParentId { get; set; }

    [ForeignKey("ParentId")]
    public CodeReferenceEntity? Parent { get; set; }

    public List<CodeReferenceEntity> Children { get; set; } = new();
}
