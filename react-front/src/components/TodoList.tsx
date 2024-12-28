import React, { useEffect, useState } from 'react';
import { fetchTodos } from '../services/api';

type Todo = {
    bookId: number;
    author: string;
    description: string;
};

const TodosList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTodos = async () => {
            try {
                const data = await fetchTodos();
                setTodos(data); // This works now since fetchTodos() returns Todo[]
            } catch (err: any) {
                // Log the error to get more information
                console.error('Error fetching todos:', err);
                setError('Failed to fetch todonnnnns');
            }
        };

        loadTodos();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Todos List</h1>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.bookId}>
                        <strong>Author:</strong> {todo.author} <br />
                        <strong>Description:</strong> {todo.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodosList;
