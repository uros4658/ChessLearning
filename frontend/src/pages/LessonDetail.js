import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { AuthContext } from "../context/AuthContext";
import NotesSection from "./NotesSection";
const API_URL = process.env.REACT_APP_API_URL;

export default function LessonDetail() {
  const { user, login } = useContext(AuthContext);
  const [completed, setCompleted] = useState(false);
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [relatedLessons, setRelatedLessons] = useState([]);
  const [chess, setChess] = useState(null);
  const [currentMove, setCurrentMove] = useState(0);
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
  const [boardKey, setBoardKey] = useState(0); // to force board re-render

  useEffect(() => {
    axios.get(`${API_URL}/api/lessons/${id}`)
      .then(res => {
        setLesson(res.data);
        if (res.data.fen) setChess(new Chess(res.data.fen));
        else setChess(new Chess());
        setCurrentMove(0);
        setMessage("");
        setHint("");
        setBoardKey(prev => prev + 1);
      })
      .catch(() => setLesson(null));
    axios.get(`${API_URL}/api/lessons/${id}/related`)
      .then(res => setRelatedLessons(res.data))
      .catch(() => setRelatedLessons([]));
  }, [id]);

  if (!lesson || !chess) return <Layout><div>Loading...</div></Layout>;

  // Play moves up to currentMove
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

  // Handle user move
  const onPieceDrop = (sourceSquare, targetSquare) => {
    if (!lesson.moves || currentMove >= lesson.moves.length) return false;
    const chessInstance = new Chess(getBoard());
    const expectedMove = lesson.moves[currentMove];
    const legalMoves = chessInstance.moves({ verbose: true });
    const move = legalMoves.find(
      m => m.from === sourceSquare && m.to === targetSquare
    );
    if (!move) {
      setMessage("Illegal move!");
      setHint("");
      return false;
    }
    if (move.san === expectedMove) {
      chessInstance.move(move.san);
      setCurrentMove(currentMove + 1);
      setMessage("Correct move!");
      setHint("");
      setBoardKey(prev => prev + 1);
      return true;
    } else {
      setMessage("Wrong move! Try again.");
      setHint("");
      return false;
    }
  };

  const handlePrev = () => {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
      setMessage("");
      setHint("");
      setBoardKey(prev => prev + 1);
    }
  };

  const handleHint = () => {
    if (lesson.moves && lesson.moves[currentMove]) {
      setHint(`Hint: The correct move is ${lesson.moves[currentMove]}`);
      setMessage("");
    }
  };

  const handleNext = () => {
    if (lesson.moves && currentMove < lesson.moves.length) {
      setCurrentMove(currentMove + 1);
      setMessage(`Moved to next step. The correct move was: ${lesson.moves[currentMove]}`);
      setHint("");
      setBoardKey(prev => prev + 1);
    }
  };

  const handleComplete = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/progress/${lesson.id}`, {
        status: "completed",
        userId: user.id
      });
      setCompleted(true);
      // Update user context with new xp/level/streak
      login({ user: { ...user, xp: res.data.xp, level: res.data.level, streak: res.data.streak }, token: localStorage.getItem("token") });
    } catch (err) {
      alert("Error marking as completed");
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
                <Chessboard
                  key={boardKey}
                  position={getBoard()}
                  onPieceDrop={onPieceDrop}
                  arePiecesDraggable={true}
                />
                <div className="mt-3">
                  <button className="btn btn-secondary me-2" onClick={handlePrev} disabled={currentMove === 0}>Previous</button>
                  <button className="btn btn-info me-2" onClick={handleHint} disabled={currentMove >= (lesson.moves ? lesson.moves.length : 0)}>Hint</button>
                  <button className="btn btn-success" onClick={handleNext} disabled={currentMove >= (lesson.moves ? lesson.moves.length : 0)}>Next</button>
                </div>
                {hint && <div className="alert alert-info mt-3">{hint}</div>}
                {lesson.explanations && lesson.explanations[currentMove - 1] && (
                  <div className="alert alert-info mt-3">{lesson.explanations[currentMove - 1]}</div>
                )}
                {message && <div className="alert alert-warning mt-3">{message}</div>}
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
      <button className="btn btn-success mt-3" onClick={handleComplete} disabled={completed}>
        {completed ? "Lesson Completed" : "Mark as Completed"}
      </button>
      <div className="mt-4">
        <h5>Community Notes</h5>
        <NotesSection lessonId={lesson.id} />
      </div>
    </Layout>
  );
}