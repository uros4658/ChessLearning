import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function AddLesson() {
  const { token, user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "",
    content: "",
    relatedLessonId: "",
    fen: "",
    moves: "",
    type: "opening",
    explanations: ""
  });
  const [message, setMessage] = useState("");

  if (!user || user.role !== "admin") {
    return <Layout><div className="alert alert-danger">Admin access only</div></Layout>;
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Parse moves and explanations as arrays
      const lessonData = {
        ...form,
        relatedLessonId: form.relatedLessonId ? Number(form.relatedLessonId) : null,
        moves: form.moves ? form.moves.split(',').map(m => m.trim()) : [],
        explanations: form.explanations ? form.explanations.split('|').map(e => e.trim()) : []
      };
      await axios.post("http://localhost:5000/api/lessons", lessonData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Lesson created!");
    } catch (err) {
      setMessage("Error creating lesson");
    }
  };

  return (
    <Layout>
      <h2>Add Lesson</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Content</label>
          <textarea className="form-control" name="content" value={form.content} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Type</label>
          <select className="form-control" name="type" value={form.type} onChange={handleChange}>
            <option value="opening">Opening</option>
            <option value="endgame">Endgame</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Related Lesson ID (optional)</label>
          <input className="form-control" name="relatedLessonId" value={form.relatedLessonId} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>FEN (optional)</label>
          <input className="form-control" name="fen" value={form.fen} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Moves (comma separated, e.g. Nf3,e5,Nc6)</label>
          <input className="form-control" name="moves" value={form.moves} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Explanations (separate by |, e.g. "First move|Second move")</label>
          <input className="form-control" name="explanations" value={form.explanations} onChange={handleChange} />
        </div>
        <button className="btn btn-primary" type="submit">Add Lesson</button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </Layout>
  );
}