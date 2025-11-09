using Data;
using Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    private ICodeReferenceRepository? _codeReferences;
    private IProblemRepository? _problems;
    private IUserRepository? _users;
    private IUserProblemSolutionRepository? _userProblemSolutions;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public ICodeReferenceRepository CodeReferences =>
        _codeReferences ??= new CodeReferenceRepository(_context);

    public IProblemRepository Problems =>
        _problems ??= new ProblemRepository(_context, null);

    public IUserRepository Users =>
        _users ??= new UserRepository(_context);

    public IUserProblemSolutionRepository UserProblemSolutions =>
        _userProblemSolutions ??= new UserProblemSolutionRepository(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
            if (_transaction != null)
                await _transaction.CommitAsync();
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}