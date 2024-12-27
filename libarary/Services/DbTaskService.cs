using libarary.Data;
using libarary.Models;

namespace libarary.Services;

public class DbTaskService : ITaskService
{
    private readonly AppDbContext _context;

    public DbTaskService(AppDbContext context)
    {
        _context = context;
    }

    public Todo AddTodo(Todo task)
    {
        var book = new Book
        {
            BookId = task.BookId,
            Author = task.Author,
            Description = task.Description
        };

        if (_context.Books.Any(b => b.BookId == book.BookId))
        {
            throw new InvalidOperationException($"A book with BookId {book.BookId} already exists.");
        }

        _context.Books.Add(book);
        _context.SaveChanges();
        return task;
    }

    public void DeleteById(int BookId)
    {
        var book = _context.Books.SingleOrDefault(b => b.BookId == BookId);
        if (book == null)
        {
            throw new InvalidOperationException($"No book found with BookId {BookId}.");
        }

        _context.Books.Remove(book);
        _context.SaveChanges();
    }

    public Todo? GetTodoById(int BookId)
    {
        var book = _context.Books.SingleOrDefault(b => b.BookId == BookId);
        return book == null ? null : new Todo(book.BookId, book.Author, book.Description);
    }

    public List<Todo> GetTodos()
    {
        return _context.Books
            .Select(b => new Todo(b.BookId, b.Author, b.Description))
            .ToList();
    }
}