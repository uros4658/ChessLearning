import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

export default function ManageLessons() {
  const { token, user } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user && user.role === "admin") {
      axios.get(`${API_URL}/api/lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setLessons(res.data))
      .catch(() => setLessons([]));
    }
  }, [token, user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await axios.delete(`${API_URL}/api/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLessons(lessons.filter(l => l.id !== id));
        setMessage("Lesson deleted.");
      } catch {
        setMessage("Error deleting lesson.");
      }
    }
  };

  if (!user || user.role !== "admin") {
    return <Layout><div className="alert alert-danger">Admin access only</div></Layout>;
  }

  return (
    <Layout>
      <h2>Manage Lessons</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Related Lesson</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.title}</td>
              <td>{l.type}</td>
              <td>{l.relatedLessonId || "-"}</td>
              <td>
                <Link to={`/lessons/${l.id}`} className="btn btn-info btn-sm me-2">View</Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}