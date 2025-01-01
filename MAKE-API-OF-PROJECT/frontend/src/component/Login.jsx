import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [value, setValue] = useState(JSON.parse(localStorage.getItem("token")) || []);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("token", JSON.stringify(value));
    }, [value]);

    const handleData = (e) => {
        e.preventDefault();

        axios.post(`http://localhost:8000/user/login`, form) // Replace with your backend endpoint
            .then((res) => {
                console.log("Response:", res.data);
                setValue(res.data);
                navigate("/todo");
            })
            .catch((error) => {
                console.log("Error submitting data:", error);
            });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="col-md-5">
                <div className="card shadow-lg border-0 rounded">
                    <div className="card-header bg-dark text-white text-center py-3">
                        <h2 className="fw-bold mb-0">Login</h2>
                        <p className="small mb-0">Welcome back! Please login to your account</p>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleData}>
                            <div className="form-group mb-3">
                                <label htmlFor="inputEmail" className="form-label fw-semibold">Email</label>
                                <input
                                    type="email"
                                    className="form-control rounded-pill shadow-sm"
                                    id="inputEmail"
                                    placeholder="example@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="inputPassword" className="form-label fw-semibold">Password</label>
                                <input
                                    type="password"
                                    className="form-control rounded-pill shadow-sm"
                                    id="inputPassword"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow">Login</button>
                            </div>
                        </form>
                        <div className="text-center mt-4">
                            <p className="small">
                                Don't have an account? <Link to={"/"} className="text-primary text-decoration-none fw-bold">Sign Up</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
