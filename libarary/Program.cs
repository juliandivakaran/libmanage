using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Rewrite;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseRewriter(new RewriteOptions().AddRedirect("tasks/(.*)", "todos/$1"));
app.Use(async (context, next) =>{
    Console.WriteLine($"[{context.Request.Method} {context.Request.Path}{DateTime.UtcNow}] Started.");
    await next(context);
    Console.WriteLine($"[{context.Request.Method} {context.Request.Path}{DateTime.UtcNow}] Finished.");
    

});

// In-memory list of todos
var todos = new List<Todo>();

app.MapGet("/todos", () => todos);

// GET endpoint to fetch a todo by ID
app.MapGet("/todos/{id}", (int id) =>
{
    var targetTodo = todos.SingleOrDefault(t => id == t.BookId);
    return targetTodo is null
        ? Results.NotFound() // Use Results helper for NotFound
        : Results.Ok(targetTodo); // Use Results helper for Ok
});

// POST endpoint to create a new todo
app.MapPost("/todos", (Todo task) =>
{
    todos.Add(task);
    return Results.Created($"/todos/{task.BookId}", task); // Use Results helper for Created
});


app.MapDelete("/todos/{id}", (int id) =>
{
    todos.RemoveAll(t => id == t.BookId);
    return Results.NoContent();
});

app.Run();

// Define the Todo record
public record Todo(int BookId, string Author, string description, bool IsCompleted);

