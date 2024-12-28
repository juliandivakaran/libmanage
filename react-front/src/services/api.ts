import axios from 'axios';

type Todo = {
    bookId: number;
    author: string;
    description: string;
};

export const fetchTodos = async (): Promise<Todo[]> => {
    try {
        const response = await axios.get<Todo[]>('http://localhost:5213/todos');
        console.log('Fetched todos:', response.data);
        return response.data;
    } catch (error) {
        // Log the error for more details
        console.error('Error fetching todos:', error);
        throw new Error('Failed to fetch todoos');
    }
};

export const postTodo = async (newTodo: Todo): Promise<Todo> => {
    try {
        const response = await axios.post<Todo>('http://localhost:5213/todos', newTodo);
        console.log('Posted new todo:', response.data);
        return response.data;
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error posting new todo:', error);
        throw new Error('Failed to post new todo');
    }
};

export const deleteTodo = async (bookId: number): Promise<void> => {
    try {
        const response = await axios.delete(`http://localhost:5213/todos/${bookId}`);
        console.log(`Deleted todo with BookId: ${bookId}`, response);
    } catch (error) {
        console.error(`Error deleting todo with BookId ${bookId}:`, error);
        throw new Error('Failed to delete todo');
    }
};

export const updateTodo = async (bookId: number, updatedTodo: Todo): Promise<Todo> => {
    try {
        const response = await axios.put<Todo>(`http://localhost:5213/todos/${bookId}`, updatedTodo);
        console.log(`Updated todo with BookId: ${bookId}`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating todo with BookId ${bookId}:`, error);
        throw new Error('Failed to update todo');
    }
};
