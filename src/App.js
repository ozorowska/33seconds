import React, { useState } from "react";
import "./App.css"; // Importuj style CSS
import "bootstrap/dist/css/bootstrap.min.css";
import Quiz from "./Components/Quiz";

function App() {
  const [view, setView] = useState("home");

  const handlePlayClick = () => {
    setView("quiz");
  };

  return (
    <div className="App">
      <div className="container">
        <header className="App-header mb-5">
          <h1 className="display-4">33 seconds quiz</h1>
        </header>
        <main className="App-main">
          {view === "home" && (
            <>
              <button
                onClick={handlePlayClick}
                className="btn btn-success btn-lg btn-play"
              >
                Play
              </button>
              <div className="top-score">Top score: 20</div>
            </>
          )}
          {view === "quiz" && <Quiz />}
        </main>
      </div>
      <footer className="App-footer mt-5">
        <p>&copy; 2024 33 seconds quiz. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
