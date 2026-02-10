using Microsoft.EntityFrameworkCore;
using ASI.Basecode.Data.Models;
using System.Linq;

namespace ASI.Basecode.Data
{
    public partial class AsiBasecodeDBContext : DbContext
    {
        public AsiBasecodeDBContext(DbContextOptions<AsiBasecodeDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; } = null!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Users
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.UserId).IsUnique();

                entity.Property(u => u.UserId).IsRequired().HasMaxLength(50);
                entity.Property(u => u.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.MiddleName).HasMaxLength(50);
                entity.Property(u => u.LastName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Program).HasMaxLength(50);
                entity.Property(u => u.HashedPassword).IsRequired();
                entity.Property(u => u.CreatedTime).IsRequired();
                entity.Property(u => u.Role).IsRequired();
                entity.Property(u => u.IsDeleted).IsRequired().HasDefaultValue(false);
            });
        }


        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
