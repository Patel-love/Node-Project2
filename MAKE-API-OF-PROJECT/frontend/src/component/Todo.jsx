import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Todo() {
    const [todoData, setTodoData] = useState({ todoName: "" });
    const [lsData, setLsData] = useState(JSON.parse(localStorage.getItem("token")) || {});
    const [todos, setTodos] = useState([]);
    const [editTodo, setEditTodo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!lsData.token) {
            navigate("/login");
            return;
        }

        const config = {
            headers: {
                authorization: `Bearer ${lsData.token}`,
            },
        };

        axios
            .get("http://localhost:8000/todo", config)
            .then((res) => {
                setTodos(res.data.todos || []);
            })
            .catch((err) => {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            });
    }, [lsData.token, navigate]);

    const submitToDoHandler = (e) => {
        e.preventDefault();

        if (!lsData.token) return;

        const config = {
            headers: {
                authorization: `Bearer ${lsData.token}`,
            },
        };

        if (editTodo) {
            // Update existing todo
            axios
                .put(
                    `http://localhost:8000/todo/edittodo/${editTodo._id}`,
                    { todoName: todoData.todoName },
                    config
                )
                .then((res) => {
                    setTodos(res.data.todos)
                    setEditTodo(null);
                    setTodoData({ todoName: "" });
                })
                .catch((err) => console.error(err));
        } else {
            // Add new todo
            axios
                .post(
                    "http://localhost:8000/todo/addTodo",
                    { todoName: todoData.todoName },
                    config
                )
                .then((res) => {
                    setTodos((prevTodos) => [...prevTodos, res.data.newTodo]);
                    setTodoData({ todoName: "" });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const deleteTodoHandler = (id) => {
        const config = {
            headers: {
                authorization: `Bearer ${lsData.token}`,
            },
        };

        axios
            .delete(`http://localhost:8000/todo/deletetodo/${id}`, config)
            .then((res) => {
                setTodos(res.data.todos)
            })
            .catch((err) => console.error(err));
    };

    const startEditTodoHandler = (todo) => {
        setEditTodo(todo);
        setTodoData({ todoName: todo.todoName });
    };

    const logout = () => {
        localStorage.clear("token");
        navigate("/login");
    };

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column bg-light">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
                <div className="container">
                    <span className="navbar-brand fw-bold text-primary">{lsData.name || "Todo App"}</span>
                    <button className="btn btn-outline-danger" onClick={logout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Todo Content */}
            <div className="container my-5">
                <div className="card shadow-sm border-0 rounded">
                    <div className="card-header bg-primary text-white text-center py-3">
                        <h3 className="mb-0">Todolist</h3>
                    </div>
                    <div className="card-body">
                        {/* Add/Edit Todo Form */}
                        <form onSubmit={submitToDoHandler} className="mb-4">
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={todoData.todoName}
                                    onChange={(e) => setTodoData({ todoName: e.target.value })}
                                    placeholder="Enter a task"
                                    className="form-control rounded-pill shadow-sm"
                                />
                                <button type="submit" className="btn btn-primary ms-2 rounded-pill">
                                    {editTodo ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>

                        {/* Display Todos */}
                        <ul className="list-group">
                            {todos.map((todo) => (
                                <li
                                    key={todo._id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <span>{todo.todoName}</span>
                                    <div>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => startEditTodoHandler(todo)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteTodoHandler(todo._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Todo;
