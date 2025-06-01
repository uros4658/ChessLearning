# Chess Lessons Platform

A full-stack web application for interactive chess learning, featuring:
- Interactive chessboard lessons
- XP, levels, and streaks for gamification
- Community notes for each lesson
- Leaderboard
- User following system

---

## Features

- **User Authentication:** Register, login, and secure routes.
- **Chess Lessons:** Interactive lessons with move validation, hints, and explanations.
- **Gamification:** Earn XP, level up, and maintain daily streaks for bonus XP.
- **Leaderboard:** See top users by XP.
- **Community Notes:** Add and view notes for each lesson.
- **Follow System:** Follow/unfollow users and view your followers/following.
- **Admin Dashboard:** Manage lessons and users (admin only).

---

## Tech Stack

- **Frontend:** React, Bootstrap, Axios
- **Backend:** Node.js, Express, Sequelize (PostgreSQL)
- **Database:** PostgreSQL

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chess-lessons-platform.git
cd chess-lessons-platform
```

### 2. Setup the Backend

- Install dependencies:
  ```bash
  cd backend
  npm install
  ```
- Configure your PostgreSQL database in `backend/db.js` or via environment variables.
- Run migrations to create tables (`Users`, `Lessons`, `Progress`, `Notes`, `Follows`).
- Start the backend server:
  ```bash
  npm start
  ```

### 3. Setup the Frontend

- Install dependencies:
  ```bash
  cd ../frontend
  npm install
  ```
- Create a `.env` file in `frontend/`:
  ```
  REACT_APP_API_URL=http://localhost:5000
  ```
- Start the frontend:
  ```bash
  npm start
  ```

---

## Usage

- Visit [http://localhost:3000](http://localhost:3000) in your browser.
- Register a new account or login.
- Explore lessons, complete them to earn XP, and maintain your streak.
- Add notes to lessons and view community notes.
- Follow other users by username and see your followers/following.
- Check the leaderboard to see top users.

---

## Project Structure

```
backend/
  models/
  routes/
  db.js
  server.js
frontend/
  src/
    components/
    pages/
    context/
    App.js
    index.js
```

---

## Environment Variables

- **Frontend:**  
  `frontend/.env`
  ```
  REACT_APP_API_URL=http://localhost:5000
  ```

- **Backend:**  
  `backend/.env` (optional, for JWT secret, DB config, etc.)

---

## CORS

CORS is enabled for all origins in the backend (`app.use(cors());`).

---

## License

MIT

---

## Credits

- [chess.js](https://github.com/jhlywa/chess.js) for chess logic
- [react-chessboard](https://github.com/Clariity/react-chessboard) for the chessboard UI
- Bootstrap for styling

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
