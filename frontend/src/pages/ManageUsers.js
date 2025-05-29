import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
const API_URL = process.env.REACT_APP_API_URL;

export default function ManageUsers() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user && user.role === "admin") {
      axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
    }
  }, [token, user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(u => u.id !== id));
        setMessage("User deleted.");
      } catch {
        setMessage("Error deleting user.");
      }
    }
  };

  if (!user || user.role !== "admin") {
    return <Layout><div className="alert alert-danger">Admin access only</div></Layout>;
  }

  return (
    <Layout>
      <h2>Manage Users</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== "admin" && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}