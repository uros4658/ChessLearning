import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
const API_URL = process.env.REACT_APP_API_URL;

export default function FollowPage() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/api/follows/following/${user.id}`).then(res => setFollowing(res.data));
      axios.get(`${API_URL}/api/follows/followers/${user.id}`).then(res => setFollowers(res.data));
    }
  }, [user]);

  const handleSearch = async e => {
    e.preventDefault();
    setMessage("");
    setSearchResult(null);
    if (!search.trim()) return;
    try {
      const res = await axios.get(`${API_URL}/api/users`);
      const found = res.data.find(u => u.username.toLowerCase() === search.trim().toLowerCase());
      if (found) setSearchResult(found);
      else setMessage("User not found");
    } catch {
      setMessage("Error searching user");
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(`${API_URL}/api/follows/follow`, { followerId: user.id, username: searchResult.username });
      setMessage(`You are now following ${searchResult.username}`);
      setFollowing([...following, searchResult]);
    } catch {
      setMessage("Error following user");
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(`${API_URL}/api/follows/unfollow`, { followerId: user.id, username: searchResult.username });
      setMessage(`You unfollowed ${searchResult.username}`);
      setFollowing(following.filter(f => f.id !== searchResult.id));
    } catch {
      setMessage("Error unfollowing user");
    }
  };

  return (
    <Layout>
      <h2>Follow People</h2>
      <form className="mb-3" onSubmit={handleSearch}>
        <div className="input-group">
          <input className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search username..." />
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </form>
      {message && <div className="alert alert-info">{message}</div>}
      {searchResult && (
        <div className="mb-3">
          <b>{searchResult.username}</b>
          {searchResult.id === user.id ? (
            <span className="ms-2 text-muted">(You)</span>
          ) : following.some(f => f.id === searchResult.id) ? (
            <button className="btn btn-warning btn-sm ms-2" onClick={handleUnfollow}>Unfollow</button>
          ) : (
            <button className="btn btn-success btn-sm ms-2" onClick={handleFollow}>Follow</button>
          )}
        </div>
      )}
      <div className="row">
        <div className="col-md-6">
          <h5>Following</h5>
          <ul className="list-group">
            {following.map(f => (
              <li className="list-group-item" key={f.id}>{f.username}</li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h5>Followers</h5>
          <ul className="list-group">
            {followers.map(f => (
              <li className="list-group-item" key={f.id}>{f.username}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}