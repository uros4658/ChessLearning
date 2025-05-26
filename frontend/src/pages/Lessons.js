import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/lessons")
      .then(res => setLessons(res.data))
      .catch(() => setLessons([]));
  }, []);

  return (
    <Layout>
      <h2 className="mb-4">Your Lessons</h2>
      <div className="row">
        {lessons.map(lesson => (
          <div className="col-md-6 col-lg-4 mb-4" key={lesson.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{lesson.title}</h5>
                <p className="card-text text-truncate">{lesson.content}</p>
                <Link className="btn btn-outline-primary mt-auto" to={`/lessons/${lesson.id}`}>View Lesson</Link>
                {lesson.relatedLessonId && (
                  <div className="mt-2">
                    <small className="text-muted">Related to lesson #{lesson.relatedLessonId}</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}