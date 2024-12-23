var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// In-memory list of todos
var todos = new List<Todo>();

// POST endpoint to create a new todo
app.MapPost("/todos", (Todo task) =>
{
    todos.Add(task);
    return Results.Created($"/todos/{task.Id}", task);
});

// GET endpoint to fetch a todo by ID
app.MapGet("/todos/{id}", (int id) =>
{
    var todo = todos.FirstOrDefault(t => t.Id == id);
    if (todo is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(todo);
});

app.Run();

// Define the Todo record
public record Todo(int Id, string Name, DateTime DueDate, bool IsComplete);
