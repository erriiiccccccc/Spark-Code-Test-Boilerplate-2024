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

  // Take user inputs and format them for POST
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // POST user input to memory 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("FormData on form submit:", JSON.stringify(formData)); // Debugging
  
    try {
      const response = await fetch("http://localhost:8080/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      // if response = 200OK then success message
      if (response.ok) {
        const result = await response.json();
        console.log("Success response:", result);
        setStatus(result.message);
        setTodos((prev) => (Array.isArray(prev) ? [...prev, formData] : [formData]));
        setFormData({ title: "", description: "" });
      } else {
        setStatus("Failed to add todo");
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatus("Error occurred while adding todo");
    }
  };  

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      {/* Show all the retrieved todos */}
      <div className="todo-list">
        {todos && todos.length > 0 ? (
          todos.map((todo) =>
            <Todo
              key={todo.title + todo.description}
              title={todo.title}
              description={todo.description}
            />
          )
        ) : (
          <p>Add a Todo now! :)</p>
        )}
      </div>

      {/* Handles user inputs and post */}
      <h2>Add a Todo</h2>
      <form onSubmit={handleSubmit}>
      <input
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          autoFocus
          required
        />
        <input
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Todo</button>
        </form>
        {status}
    </div>
  );
}

export default App;
