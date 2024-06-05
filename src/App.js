import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Quiz from "./Components/Quiz";

function App() {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [topScore, setTopScore] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy'); // Domyślnie łatwy poziom trudności

  const handlePlayClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setIsQuizActive(true);
  };

  const handleTryAgain = (score) => {
    setIsQuizActive(false); // Ustawiamy stan na false po kliknięciu przycisku "Try Again"
    if (score > topScore) {
      setTopScore(score);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="App-header mb-5">
          <h1 className="display-4">33 seconds quiz</h1>
        </header>
        <main className="App-main">
          {/* Renderujemy komponent Quiz tylko jeśli isQuizActive jest true */}
          {isQuizActive ? (
            <Quiz onTryAgain={handleTryAgain} difficulty={selectedDifficulty} />
          ) : (
            <>
              <button
                onClick={() => handlePlayClick('easy')}
                className="btn btn-success btn-lg btn-play"
              >
                Play Easy
              </button>
              <button
                onClick={() => handlePlayClick('medium')}
                className="btn btn-warning btn-lg btn-play"
              >
                Play Medium
              </button>
              <button
                onClick={() => handlePlayClick('hard')}
                className="btn btn-danger btn-lg btn-play"
              >
                Play Hard
              </button>
              <div className="top-score">Top score: {topScore}</div>
            </>
          )}
        </main>
      </div>
      <footer className="App-footer mt-5">
        <p>&copy; 2024 33 seconds quiz. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
