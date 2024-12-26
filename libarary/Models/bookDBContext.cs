using Microsoft.EntityFrameworkCore;
 // Make sure you have the correct namespace

namespace libarary.Models
{
    public class bookDBContext : DbContext
    {
        public bookDBContext(DbContextOptions<bookDBContext> options) : base(options) { }

        // Explicitly define primary key for RpgCharacter if needed
        public DbSet<RpgCharacter> RpgCharacters { get; set; } = null!;
        public required DbSet<Todo> Todos { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Explicitly define the primary key for Todo and RpgCharacter if needed
            modelBuilder.Entity<RpgCharacter>().HasKey(r => r.BookId);
            modelBuilder.Entity<Todo>().HasKey(t => t.BookId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
