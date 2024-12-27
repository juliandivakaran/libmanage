using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using libarary.Data;
using libarary.Models;
using libarary.Services;  // <-- Add this line


var builder = WebApplication.CreateBuilder(args);

// Register DbContext
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register TaskService using the database
builder.Services.AddScoped<ITaskService, DbTaskService>();

builder.Services.AddDirectoryBrowser();

var app = builder.Build();

// Ensure the database is created
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRewriter(new RewriteOptions().AddRedirect("tasks/(.*)", "todos/$1"));

app.Use(async (context, next) =>
{
    Console.WriteLine($"[{context.Request.Method} {context.Request.Path} {DateTime.UtcNow}] Started.");
    await next();
    Console.WriteLine($"[{context.Request.Method} {context.Request.Path} {DateTime.UtcNow}] Finished.");
});

// CRUD endpoints
app.MapGet("/todos", (ITaskService service) => service.GetTodos());

app.MapGet("/todos/{BookId}", (int BookId, ITaskService service) =>
{
    var targetTodo = service.GetTodoById(BookId);
    return targetTodo is null
        ? Results.NotFound($"Book with BookId {BookId} not found.")
        : Results.Ok(targetTodo);
});

app.MapPost("/todos", (Todo task, ITaskService service) =>
{
    try
    {
        service.AddTodo(task);
        return Results.Created($"/todos/{task.BookId}", task);
    }
    catch (InvalidOperationException ex)
    {
        return Results.Conflict(ex.Message);
    }
});

app.MapDelete("/todos/{BookId}", (int BookId, ITaskService service) =>
{
    try
    {
        service.DeleteById(BookId);
        return Results.NoContent();
    }
    catch (InvalidOperationException ex)
    {
        return Results.NotFound(ex.Message);
    }
});

app.Run();

public record Todo(int BookId, string Author, string Description);

interface ITaskService
{
    Todo? GetTodoById(int BookId);
    List<Todo> GetTodos();
    void DeleteById(int BookId);
    Todo AddTodo(Todo task);
}
