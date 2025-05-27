import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <Layout><div className="alert alert-danger">Admin access only</div></Layout>;
  }

  return (
    <Layout>
      <h2>Admin Dashboard</h2>
      <div className="list-group">
        <Link to="/add-lesson" className="list-group-item list-group-item-action">
          Add New Lesson
        </Link>
        <Link to="/manage-users" className="list-group-item list-group-item-action">
         Manage Users
        </Link>
        <Link to="/manage-lessons" className="list-group-item list-group-item-action">
          Manage Lessons
        </Link>
        </div>
    </Layout>
  );
}