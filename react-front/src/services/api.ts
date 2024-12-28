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
