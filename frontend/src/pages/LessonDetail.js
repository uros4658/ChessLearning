import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [relatedLessons, setRelatedLessons] = useState([]);
  const [chess, setChess] = useState(null);
  const [currentMove, setCurrentMove] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/lessons/${id}`)
      .then(res => {
        setLesson(res.data);
        if (res.data.fen) setChess(new Chess(res.data.fen));
        else setChess(new Chess());
        setCurrentMove(0);
      })
      .catch(() => setLesson(null));
    axios.get(`http://localhost:5000/api/lessons/${id}/related`)
      .then(res => setRelatedLessons(res.data))
      .catch(() => setRelatedLessons([]));
  }, [id]);

  if (!lesson || !chess) return <Layout><div>Loading...</div></Layout>;

  const getBoard = () => {
    const chessInstance = new Chess(lesson.fen || undefined);
    if (lesson.moves && lesson.moves.length > 0) {
      for (let i = 0; i < currentMove; i++) {
        try {
          chessInstance.move(lesson.moves[i]);
        } catch (e) {
          break;
        }
      }
    }
    return chessInstance.fen();
  };

  const handleNext = () => {
    if (lesson.moves && currentMove < lesson.moves.length) {
      setCurrentMove(currentMove + 1);
    }
  };

  const handlePrev = () => {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">{lesson.type === "opening" ? "Opening" : "Endgame"} Lesson</div>
            <div className="card-body">
              <h5>{lesson.title}</h5>
              <div>{lesson.content}</div>
              <div className="my-3 d-flex flex-column align-items-center">
                <Chessboard position={getBoard()} arePiecesDraggable={false} />
                <div className="mt-3">
                  <button className="btn btn-secondary me-2" onClick={handlePrev} disabled={currentMove === 0}>Previous</button>
                  <button className="btn btn-secondary" onClick={handleNext} disabled={!lesson.moves || currentMove === lesson.moves.length}>Next</button>
                </div>
                {lesson.explanations && lesson.explanations[currentMove - 1] && (
                  <div className="alert alert-info mt-3">{lesson.explanations[currentMove - 1]}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header bg-success text-white">Related Lessons</div>
            <div className="card-body">
              {relatedLessons.length > 0 ? (
                <ul className="list-group">
                  {relatedLessons.map(rl => (
                    <li key={rl.id} className="list-group-item">
                      <Link to={`/lessons/${rl.id}`}>{rl.title}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No related lessons.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}