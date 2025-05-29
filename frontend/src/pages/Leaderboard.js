import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;


export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
      axios.get(`${API_URL}/api/users/leaderboard`)
      .then(res => setUsers(res.data));
  }, []);
  return (
    <div className="card shadow mt-4">
      <div className="card-header bg-primary text-white">
        <h2 className="mb-0">Leaderboard</h2>
      </div>
      <div className="card-body">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Username</th>
              <th>XP</th>
              <th>Level</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.xp}</td>
                <td>{u.level}</td>
                <td>{u.streak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}