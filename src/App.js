import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Quiz from './Components/Quiz';
import Login from './Components/Login';
import Register from './Components/Register';
import Leaderboard from './Components/Leaderboard'; // Importuj Leaderboard
import axios from 'axios';

function App() {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [topScore, setTopScore] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handlePlayClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setIsQuizActive(true);
  };

  const handleTryAgain = async (score) => {
    setIsQuizActive(false);
    if (score > topScore) {
      setTopScore(score);
      if (user) {
        try {
          await axios.put('http://localhost:5000/api/users/score', {
            token,
            difficulty: selectedDifficulty,
            score,
          });
        } catch (err) {
          console.error('Error updating score:', err);
        }
      }
    }
  };

  const handleLogin = (data) => {
    setUser(data.user);
    setToken(data.token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setIsQuizActive(false);
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <Router>
      <div className="App">
        <div className="container">
          <header className="App-header mb-5">
            <h1 className="display-4">33 seconds quiz</h1>
            {user && (
              <button onClick={handleLogout} className="btn btn-danger logout-button">Logout</button>
            )}
          </header>
          <main className="App-main">
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/quiz" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quiz" element={user ? (
                <>
                  {isQuizActive ? (
                    <Quiz onTryAgain={handleTryAgain} difficulty={selectedDifficulty} />
                  ) : (
                    <>
                      <button onClick={() => handlePlayClick('easy')} className="btn btn-primary btn-lg btn-play">
                        Play Easy
                      </button>
                      <button onClick={() => handlePlayClick('medium')} className="btn btn-primary btn-lg btn-play">
                        Play Medium
                      </button>
                      <button onClick={() => handlePlayClick('hard')} className="btn btn-primary btn-lg btn-play">
                        Play Hard
                      </button>
                      <div className="top-score">Top score: {topScore}</div>
                      <Leaderboard />
                    </>
                  )}
                </>
              ) : (
                <Navigate to="/login" />
              )} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
        <footer className="App-footer mt-5">
          <p>&copy; 2024 33 seconds quiz. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
