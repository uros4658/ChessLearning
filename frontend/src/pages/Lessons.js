import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/lessons")
      .then(res => setLessons(res.data))
      .catch(() => setLessons([]));
  }, []);

  return (
    <div>
      <h2>Your Lessons</h2>
      <ul>
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <Link to={`/lessons/${lesson.id}`}>{lesson.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}