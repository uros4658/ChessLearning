import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
      login(res.data); // res.data = { user, token }
      navigate("/lessons");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="mb-4 text-center">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Email</label>
                  <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary w-100" type="submit">Login</button>
              </form>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              <div className="mt-3 text-center">
                <Link to="/register">Don't have an account? Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}