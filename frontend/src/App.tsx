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
        console.log("Fetched todos:", data); // Debugging output
        if (Array.isArray(data.data)) {
          setTodos(data.data); // Ensure it's an array
        } else {
          console.error("Todos response is not an array:", data.data);
        }
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
        {todos && todos.length > 0 ? (
          todos.map((todo, index) => (
            <div key={index} className="todo-item">
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
            </div>
          ))
        ) : (
          <p>Add a Todo now! :)</p>
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
