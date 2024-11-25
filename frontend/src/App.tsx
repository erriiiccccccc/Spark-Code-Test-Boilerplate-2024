import React, { useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  // to form inputs from frontend
  const [formData, setFormData] = useState<TodoType>({ title: "", description: "" }); 
  // to display status for debugging
  const [status, setStatus] = useState<string>(""); 

  // Initially fetch all the todos that we have
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch('http://localhost:8080/todos');
        if (todos.status !== 200) {
          console.log('Error fetching data');
          return;
        }
        const data = await todos.json();
        console.log("Fetched todos:", data); 
        setTodos(data.data); 
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) =>
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form>
        <input placeholder="Title" name="title" autoFocus={true} />
        <input placeholder="Description" name="description" />
        <button>Add Todo</button>
      </form>
    </div>
  );
}

export default App;
