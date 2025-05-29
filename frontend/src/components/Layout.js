import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/lessons">Chess Lessons</Link>
          <div>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link className="btn btn-warning btn-sm me-2" to="/admin">Admin Dashboard</Link>
                )}
                {user && (
                  <>
                    <span className="badge bg-success me-2">XP: {user.xp}</span>
                    <span className="badge bg-primary me-2">Level: {user.level}</span>
                    <span className="badge bg-warning text-dark">Streak: {user.streak} days</span>
                  </>
                )}
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm me-2" to="/login">Login</Link>
                <Link className="btn btn-outline-light btn-sm" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}