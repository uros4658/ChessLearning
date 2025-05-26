import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [relatedLesson, setRelatedLesson] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/lessons/${id}`)
      .then(res => {
        setLesson(res.data);
        if (res.data.relatedLessonId) {
          axios.get(`http://localhost:5000/api/lessons/${res.data.relatedLessonId}`)
            .then(r => setRelatedLesson(r.data))
            .catch(() => setRelatedLesson(null));
        } else {
          setRelatedLesson(null);
        }
      })
      .catch(() => setLesson(null));
  }, [id]);

  if (!lesson) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">Openings</div>
            <div className="card-body">
              <h5>{lesson.title}</h5>
              <div>{lesson.content}</div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-success text-white">Endgame Lessons</div>
            <div className="card-body">
              {relatedLesson ? (
                <>
                  <h5>{relatedLesson.title}</h5>
                  <div>{relatedLesson.content}</div>
                  <Link to={`/lessons/${relatedLesson.id}`} className="btn btn-outline-secondary btn-sm mt-2">
                    Go to Related Lesson
                  </Link>
                </>
              ) : (
                <div>No related endgame lesson.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}