using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.Builder;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ITaskService>(new InMemoryTaskService());

var app = builder.Build();
var todos = new List<Todo>();

app.UseRewriter(new RewriteOptions().AddRedirect("tasks/(.*)", "todos/$1"));
app.Use(async (context, next) =>
{
    Console.WriteLine($"[{context.Request.Method} {context.Request.Path} {DateTime.UtcNow}] Started.");
    await next();
    Console.WriteLine($"[{context.Request.Method} {context.Request.Path} {DateTime.UtcNow}] Finished.");
});




// In-memory list of todos
//var todos = new List<Todo>();


app.MapGet("/todos", (ITaskService service) => service.GetTodos());

// GET endpoint to fetch a todo by ID
app.MapGet("/todos/{id}", (int BookId, ITaskService service) =>
{
    var targetTodo = service.GetTodoById(BookId);
    return targetTodo is null
        ? Results.NotFound() // Use Results helper for NotFound
        : Results.Ok(targetTodo); // Use Results helper for Ok
});

// POST endpoint to create a new todo
app.MapPost("/todos", (Todo task,ITaskService service) =>
{
     if (todos.Any(t => t.BookId == task.BookId))
    {
        return Results.Conflict($"A task with BookId {task.BookId} already exists.");
    }
    service.AddTodo(task);
    return Results.Created($"/todos/{task.BookId}", task); // Use Results helper for Created
});
//.AddEndpointFilter(async(context, next)=>{
 //   var taskArgument = context.GetArgument<Todo>(0);
//    var errors = new Dictionary<string, string[]>();
//    if (taskArgument.DueDate < DateTime.UtcNow)
  //  {
    //    errors.Add(nameof(Todo.Duedate), ["Cannot have due date in the past"]);
//    }
//   if (taskArgument.IsCompleted){
 //       errors.Add(nameof(Todo.IsCompleted), ["Cannot add completed"]);
//    }
//    if (errors.Count > 0)
//    {
//        return Results.ValidationProblem(errors);
//    }
//    return await next(context);
//}); 


app.MapDelete("/todos/{id}", (int BookId, ITaskService service) =>
{
    service.DeleteById(BookId);
    return Results.NoContent();
});

app.Run();

// Define the Todo record
public record Todo(int BookId, string Author, string Description);

interface ITaskService
{
    Todo? GetTodoById(int BookId);

    List<Todo>GetTodos();

    void DeleteById(int BookId);

    Todo AddTodo(Todo task);
}

class InMemoryTaskService : ITaskService
{
    private readonly List<Todo>_todos = [];

    public Todo AddTodo(Todo task)
    {
        _todos.Add(task);
        return task;
    }

    public void DeleteById(int BookId)
    {
        _todos.RemoveAll(task => BookId == task.BookId);
    }

    public Todo? GetTodoById(int BookId)
    {
        return _todos.SingleOrDefault(t => BookId == t.BookId);
    }

    public List<Todo> GetTodos()
    {
        return _todos;
    }
}