using Microsoft.AspNetCore.Identity;

namespace Models
{
    public class User : IdentityUser
    {
        public int TotalPoints { get; set; }
        public List<UserProblemSolution> UserProblemSolutions { get; set; } = new List<UserProblemSolution>();
    }
}