using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class UserProblemSolution
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; }
        public int ProblemId { get; set; }
        public Problem Problem { get; set; } 
        public int PointsEarned { get; set; }
        public DateTime SolvedAt { get; set; }
        public string Language { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string MessageOutput { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
    }
}