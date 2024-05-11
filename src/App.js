// App.js
import React, { useState } from "react";
import "./App.css"; // Importuj style CSS
import "bootstrap/dist/css/bootstrap.min.css";
import Quiz from "./Components/Quiz";

function App() {
  const [isQuizActive, setIsQuizActive] = useState(false); // Dodajemy stan określający, czy quiz jest aktywny
  const [topScore, setTopScore] = useState(0); // Dodajemy stan dla top score

  const handlePlayClick = () => {
    setIsQuizActive(true); // Ustawiamy stan na true po kliknięciu przycisku "Play"
  };

  const handleTryAgain = (score) => {
    setIsQuizActive(false); // Ustawiamy stan na false po kliknięciu przycisku "Try Again"
    if (score > topScore) {
      setTopScore(score); // Aktualizujemy top score jeśli wynik użytkownika jest większy
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
            <Quiz onTryAgain={handleTryAgain} topScore={topScore} />
          ) : (
            <>
              <button
                onClick={handlePlayClick}
                className="btn btn-success btn-lg btn-play"
              >
                Play
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
