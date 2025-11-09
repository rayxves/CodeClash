using Interfaces;
using Models;

namespace Services;

public class UserProblemSolutionServices : IUserProblemSolutionServices
{
    private readonly IUserProblemSolutionRepository _solutionRepository;
    private readonly IProblemRepository _problemRepository;

    public UserProblemSolutionServices(
        IUserProblemSolutionRepository solutionRepository,
        IProblemRepository problemRepository)
    {
        _solutionRepository = solutionRepository;
        _problemRepository = problemRepository;
    }

    public async Task<UserProblemSolution> CreateInitialSubmissionAsync(string userId, int problemId, string language, string code)
    {
        var existingSolution = await _solutionRepository.GetByUserAndProblemAsync(userId, problemId);

        if (existingSolution != null)
            return existingSolution;

        var solution = new UserProblemSolution
        {
            UserId = userId,
            ProblemId = problemId,
            Language = language,
            Code = code,
            SolvedAt = DateTime.UtcNow,
            IsApproved = false,
            PointsEarned = 0,
            MessageOutput = "Em processamento..."
        };

        await _solutionRepository.AddAsync(solution);
        await _solutionRepository.SaveChangesAsync();
        return solution;
    }

    public async Task<UserProblemSolution> CreateUserProblemSolutionAsync(UserProblemSolutionDto userProblemSolution, string userId)
    {
        var problem = await _problemRepository.GetByIdAsync(userProblemSolution.ProblemId);
        if (problem == null)
            throw new InvalidOperationException($"Problem with ID '{userProblemSolution.ProblemId}' not found.");

        var solution = new UserProblemSolution
        {
            UserId = userId,
            ProblemId = userProblemSolution.ProblemId,
            Problem = problem,
            PointsEarned = userProblemSolution.PointsEarned,
            SolvedAt = userProblemSolution.SolvedAt,
            Language = userProblemSolution.Language,
            Code = userProblemSolution.Code,
            MessageOutput = userProblemSolution.MessageOutput,
            IsApproved = userProblemSolution.IsApproved
        };

        await _solutionRepository.AddAsync(solution);
        await _solutionRepository.SaveChangesAsync();
        return solution;
    }

    public async Task<bool> DeleteUserProblemSolutionAsync(int id)
    {
        var deleted = await _solutionRepository.DeleteAsync(id);
        if (!deleted)
            throw new InvalidOperationException($"UserProblemSolution with ID '{id}' not found.");

        await _solutionRepository.SaveChangesAsync();
        return true;
    }

    public async Task<List<UserProblemSolution>> GetAllUserProblemSolutionsAsync(string userId)
    {
        return await _solutionRepository.GetAllByUserAsync(userId);
    }

    public async Task<UserProblemSolution> GetUserProblemSolutionAsync(string userId, int problemId)
    {
        var solution = await _solutionRepository.GetByUserAndProblemAsync(userId, problemId);

        if (solution == null)
            throw new InvalidOperationException($"UserProblemSolution for User ID '{userId}' and Problem ID '{problemId}' not found.");

        return solution;
    }

    public async Task<UserProblemSolution> UpdateUserProblemSolutionAsync(UserProblemSolutionDto userProblemSolution)
    {
        var existingSolution = await _solutionRepository.GetByUserAndProblemAsync(
            userProblemSolution.UserId,
            userProblemSolution.ProblemId);

        if (existingSolution == null)
            throw new InvalidOperationException($"UserProblemSolution with ID '{userProblemSolution.ProblemId}' not found.");

        existingSolution.PointsEarned = userProblemSolution.PointsEarned;
        existingSolution.SolvedAt = userProblemSolution.SolvedAt;
        existingSolution.Language = userProblemSolution.Language;
        existingSolution.Code = userProblemSolution.Code;
        existingSolution.MessageOutput = userProblemSolution.MessageOutput;
        existingSolution.IsApproved = userProblemSolution.IsApproved;

        await _solutionRepository.UpdateAsync(existingSolution);
        await _solutionRepository.SaveChangesAsync();

        return existingSolution;
    }
}