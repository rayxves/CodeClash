using Microsoft.AspNetCore.Identity;

namespace Models
{
    public class User : IdentityUser
    {
        public string? Token { get; set; }
        public int TotalPoints { get; set; }
        public List<UserProblemSolution> UserProblemSolutions { get; set; } = new List<UserProblemSolution>();
    }
}