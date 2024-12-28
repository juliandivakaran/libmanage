import React, { useEffect, useState } from 'react';
import { fetchTodos, deleteTodo, updateTodo } from '../services/api';

type Todo = {
    bookId: number;
    author: string;
    description: string;
};

const TodosList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null); // Track the todo being edited
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTodos = async () => {
            try {
                const data = await fetchTodos();
                setTodos(data);
            } catch (err: any) {
                console.error('Error fetching todos:', err);
                setError('Failed to fetch todos');
            }
        };

        loadTodos();
    }, []);

    const handleDelete = async (bookId: number) => {
        try {
            await deleteTodo(bookId);
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.bookId !== bookId));
        } catch (err) {
            console.error('Error deleting todo:', err);
            setError('Failed to delete todo');
        }
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo); // Set the todo to be edited
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTodo) return;

        try {
            const updatedTodo = await updateTodo(editingTodo.bookId, editingTodo);
            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.bookId === editingTodo.bookId ? updatedTodo : todo
                )
            );
            setEditingTodo(null); // Reset editing state
        } catch (err) {
            console.error('Error updating todo:', err);
            setError('Failed to update todo');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingTodo) return;
        const { name, value } = e.target;
        setEditingTodo({
            ...editingTodo,
            [name]: name === 'bookId' ? parseInt(value) : value,
        });
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Todos List</h1>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.bookId}>
                        {editingTodo && editingTodo.bookId === todo.bookId ? (
                            // Inline form for editing
                            <form onSubmit={handleUpdate}>
                                <input
                                    type="number"
                                    name="bookId"
                                    value={editingTodo.bookId}
                                    onChange={handleChange}
                                    disabled // BookId is unique and shouldn't be changed
                                />
                                <input
                                    type="text"
                                    name="author"
                                    value={editingTodo.author}
                                    onChange={handleChange}
                                    required
                                />
                                <textarea
                                    name="description"
                                    value={editingTodo.description}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditingTodo(null)}>
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            // Display the todo if not being edited
                            <div>
                                <strong>Author:</strong> {todo.author} <br />
                                <strong>Description:</strong> {todo.description} <br />
                                <button onClick={() => handleEdit(todo)}>Edit</button>
                                <button onClick={() => handleDelete(todo.bookId)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodosList;
