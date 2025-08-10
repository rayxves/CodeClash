using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<CodeReferenceEntity> CodeReferences { get; set; }
    public DbSet<Problem> Problems { get; set; }
    public DbSet<TestCase> TestCases { get; set; }
    public DbSet<UserProblemSolution> UserProblemSolutions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CodeReferenceEntity>()
            .HasKey(c => c.Id);

        modelBuilder.Entity<CodeReferenceEntity>()
            .HasMany(c => c.Children)
            .WithOne(c => c.Parent)
            .HasForeignKey(c => c.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Problem>()
            .HasKey(p => p.Id);

        modelBuilder.Entity<Problem>()
            .HasMany(p => p.TestCases)
            .WithOne(t => t.Problem)
            .HasForeignKey(t => t.ProblemId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TestCase>()
            .HasKey(t => t.Id);


        modelBuilder.Entity<UserProblemSolution>()
            .HasKey(t => t.Id);

        modelBuilder.Entity<UserProblemSolution>()
            .HasOne(t => t.User)
            .WithMany(u => u.UserProblemSolutions)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

    }
}
