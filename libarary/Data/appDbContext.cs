using libarary.Models;
using Microsoft.EntityFrameworkCore;

namespace libarary.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Book> Books { get; set; } = null!;  // Suppress nullable warnings
}
