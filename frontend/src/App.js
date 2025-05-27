import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Lessons from "./pages/Lessons";
import LessonDetail from "./pages/LessonDetail";
import AddLesson from "./pages/AddLesson";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageLessons from "./pages/ManageLessons";



function PrivateRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user && user.role === "admin" ? children : <Navigate to="/admin" />;
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lessons" element={<PrivateRoute><Lessons /></PrivateRoute>} />
          <Route path="/lessons/:id" element={<PrivateRoute><LessonDetail /></PrivateRoute>} />
          <Route path="/add-lesson" element={<AdminRoute><AddLesson /></AdminRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/manage-lessons" element={<AdminRoute><ManageLessons /></AdminRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}