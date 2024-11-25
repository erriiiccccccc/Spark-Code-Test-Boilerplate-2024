import React from 'react';
import './App.css';

export type TodoType = {
  title: string,
  description: string,
  completed: boolean;
}

function Todo({ title, description, completed }: TodoType) {
  return (
    <div className="todo">
      <div className="todo-details">
        <p className="todo-title">{title}</p>
        <p className="todo-description">{description}</p>
        <p className="todo-completed">{completed}</p>
      </div>
    </div>
  );
}

export default Todo;
