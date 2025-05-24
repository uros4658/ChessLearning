import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/lessons/${id}`)
      .then(res => setLesson(res.data))
      .catch(() => setLesson(null));
  }, [id]);

  if (!lesson) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "1rem" }}>
        <h3>Openings</h3>
        <div>{lesson.openings || "No openings content."}</div>
      </div>
      <div style={{ flex: 1, padding: "1rem" }}>
        <h3>Endgame Lessons</h3>
        <div>{lesson.endgame || "No endgame content."}</div>
      </div>
    </div>
  );
}