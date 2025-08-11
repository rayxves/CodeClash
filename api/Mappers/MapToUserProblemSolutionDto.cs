
using Models;

namespace Mappers;

public static class MapToUserProblemSolutionDto
{
    public static UserProblemSolutionDto ToDto(this UserProblemSolution solution)
    {
        if (solution == null)
        {
            return null;
        }

        return new UserProblemSolutionDto
        {
            Id = solution.Id,
            UserId = solution.UserId,
            ProblemId = solution.ProblemId,
            Language = solution.Language,
            Code = solution.Code,
            SolvedAt = solution.SolvedAt,
            IsApproved = solution.IsApproved,
            PointsEarned = solution.PointsEarned,
            MessageOutput = solution.MessageOutput
        };
    }
}