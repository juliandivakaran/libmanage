import React, { useState } from 'react';
import { postTodo } from '../services/api';
import '../components/AddTodo.css';  // Import the CSS file


type Todo = {
    bookId: number;
    author: string;
    description: string;
};

const AddTodo: React.FC = () => {
    const [formData, setFormData] = useState<Todo>({
        bookId: 0,
        author: '',
        description: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'bookId' ? parseInt(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const newTodo = await postTodo(formData);
            setSuccess(`Todo with BookId ${newTodo.bookId} added successfully!`);
            setFormData({ bookId: 0, author: '', description: '' }); // Reset form
        } catch (err: any) {
            console.error('Error adding todo:', err);
            setError('Failed to add the new todo. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add a New Book</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Book ID:
                        <input
                            type="number"
                            name="bookId"
                            value={formData.bookId}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Author:
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Add Todo</button>
            </form>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default AddTodo;
