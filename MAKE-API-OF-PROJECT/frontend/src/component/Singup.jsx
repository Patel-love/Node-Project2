import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleData = (e) => {
        e.preventDefault();

        axios.post(`http://localhost:8000/user/adduser`, form)
            .then((res) => {
                navigate("/login");
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
                        <h2 className="fw-bold">Create Account</h2>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleData}>
                            <div className="form-group mb-3">
                                <label htmlFor="inputName" className="form-label fw-semibold">Name</label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill shadow-sm"
                                    id="inputName"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
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
                            <button type="submit" className="btn btn-primary btn-lg rounded-pill w-100 shadow">Sign Up</button>
                        </form>
                        <div className="text-center mt-4">
                            <p className="small">
                                Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
