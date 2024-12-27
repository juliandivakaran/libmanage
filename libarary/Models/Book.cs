namespace libarary.Models;

public class Book
{
    public int BookId { get; set; }  // Primary Key
    public string Author { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
