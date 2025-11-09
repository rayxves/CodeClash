namespace Interfaces;

public interface IUnitOfWork : IDisposable
{
    ICodeReferenceRepository CodeReferences { get; }
    IProblemRepository Problems { get; }
    IUserRepository Users { get; }
    IUserProblemSolutionRepository UserProblemSolutions { get; }
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}