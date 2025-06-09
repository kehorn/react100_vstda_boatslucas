import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function AddNewTodo({ onAdd }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({ text, priority: Number(priority), completed: false });
    setText('');
    setPriority(1);
  }

  return (
    <div className="card mb-4">
      <div className="card-header"> Add New Todo</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label"> I want to...</label>
            <textarea
              className="form-control"
              data-testid="create-todo-text"
              rows="2"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">How Much of a Priority is this?</label>
            <select
              className="form-select"
              data-testid="create-todo-priority"
              value={priority}
              onChange={e => setPriority(Number(e.target.value))}
            >
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div>
          <button
            className="btn btn-primary w-100"
            type="submit"
            data-testid="create-todo"
            disabled={!text.trim()}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

function TodoItem({
  todo, idx, onToggle, onDelete, onEdit,
  editIdx, editText, setEditText, editPriority, setEditPriority, onSaveEdit
}) {
  const priorityLabels = { 1: "High", 2: "Medium", 3: "Low" };
  const badgeClasses = { 1: "bg-danger", 2: "bg-warning", 3: "bg-secondary" };
  const priorityClass= {
    1: "priority-high",
    2: "priority-medium",
    3: "priority-low",
  }[Number(todo.priority)];

  console.log('todo.text:', todo.text, 'priority:', todo.priority, 'class:', priorityClass);

  if (editIdx === idx) {
    return (
      <li className={`list-group-item ${priorityClass}`} data-testid="todo-item">
        <form
          onSubmit={e => {
            e.preventDefault();
            onSaveEdit(idx, editText, editPriority);
          }}
          className="d-flex flex-column flex-md-row align-items-md-center"
        >
          <textarea
            className="form-control mb-2 mb-md-0 me-md-2"
            data-testid="update-todo-text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
          />
          <select
            className="form-select mb-2 mb-md-0 me-md-2"
            data-testid="update-todo-priority"
            value={editPriority}
            onChange={e => setEditPriority(Number(e.target.value))}
          >
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
          <button className="btn btn-success" data-testid="update-todo" type="submit">
            Save
          </button>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center ${priorityClass}`}
      data-testid="todo-item"
    >
      <div>
        <input
          type="checkbox"
          className="form-check-input me-2"
          checked={todo.completed}
          onChange={() => onToggle(idx)}
        />
        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.text}</span>
        <span className={`badge ms-2 ${badgeClasses[todo.priority]}`}>{priorityLabels[todo.priority]}</span>
      </div>
      <div>
        <button
          type="button"
          className="btn btn-link me-3 p-0"
          data-testid="edit-todo"
          onClick={e => { e.preventDefault(); onEdit(idx); }}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-link text-danger p-0"
          data-testid="delete-todo"
          onClick={e => { e.preventDefault(); onDelete(idx); }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

function TodoList({
  todos, onToggle, onDelete, onEdit,
  editIdx, editText, setEditText, editPriority, setEditPriority, onSaveEdit
}) {
  return (
    <div className="card">
      <div className="card-header">View Todos</div>
      <ul className="list-group list-group-flush">
        {todos.map((todo, idx) => (
          <TodoItem
            key={idx}
            todo={todo}
            idx={idx}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            editIdx={editIdx}
            editText={editText}
            setEditText={setEditText}
            editPriority={editPriority}
            setEditPriority={setEditPriority}
            onSaveEdit={onSaveEdit}
          />
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState(1);

  function addTodo(newTodo) {
    setTodos([...todos, newTodo,]);
  }

  function toggleCompleted(idx) {
    setTodos(todos =>
      todos.map((todo, i) =>
        i === idx ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(idx) {
    setTodos(todos => todos.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  }

  function startEdit(idx) {
    setEditIdx(idx);
    setEditText(todos[idx].text);
    setEditPriority(todos[idx].priority);
  }

  function saveEdit(idx, newText, newPriority) {
    setTodos(todos =>
      todos.map((todo, i) =>
        i === idx ? { ...todo, text: newText, priority: Number(newPriority) } : todo
      )
    );
    setEditIdx(null);
  }

  return (
    <div className="container my-5" style={{ maxWidth: "600px" }}>
      <h1>Very Simple Todo App</h1>
      <AddNewTodo onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleCompleted}
        onDelete={deleteTodo}
        onEdit={startEdit}
        editIdx={editIdx}
        editText={editText}
        setEditText={setEditText}
        editPriority={editPriority}
        setEditPriority={setEditPriority}
        onSaveEdit={saveEdit}
      />
    </div>
  );
}

export default App;