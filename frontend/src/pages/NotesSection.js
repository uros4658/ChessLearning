import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const API_URL = process.env.REACT_APP_API_URL;


export default function NotesSection({ lessonId }) {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  useEffect(() => {
      axios.get(`${API_URL}/api/notes/${lessonId}`)
      .then(res => setNotes(res.data));
  }, [lessonId]);
  const handleSubmit = async e => {
    e.preventDefault();
    if (!note.trim()) return;
    await axios.post(`${API_URL}/api/notes/${lessonId}`, {
      userId: user.id,
      content: note
    });
    setNote("");
    const res = await axios.get(`${API_URL}/api/notes/${lessonId}`);
    setNotes(res.data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea className="form-control mb-2" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." />
        <button className="btn btn-primary btn-sm" type="submit">Post</button>
      </form>
      <ul className="list-group mt-2">
        {notes.map(n => (
          <li className="list-group-item" key={n.id}>
            <b>User {n.userId}:</b> {n.content}
          </li>
        ))}
      </ul>
    </div>
  );
}