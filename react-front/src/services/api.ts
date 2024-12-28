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