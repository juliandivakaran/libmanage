import React from 'react';
import TodosList from './components/TodoList';
import AddTodo from './components/AddTodo';

const App: React.FC = () => {
    return (
        <div>
            <h1>Library Management</h1>
            <AddTodo />
            <TodosList />
        </div>
    );
};

export default App;
