import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Quiz.css"; // Zaimportuj plik CSS dla Quizu

function Quiz({ onTryAgain }) {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null); // Dodajemy stan dla sprawdzenia poprawności odpowiedzi
  const [score, setScore] = useState(0); // Dodajemy stan dla wyniku
  const [isQuizActive, setIsQuizActive] = useState(true); // Rozpoczynamy quiz automatycznie
  const timerRef = useRef(null); // Dodajemy ref dla timera

  const fetchRandomQuestion = async () => {
    try {
      // Pobierz losowe pytanie z API
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const countries = response.data;

      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];
      const countryName = randomCountry.name.common;
      const capital = randomCountry.capital && randomCountry.capital[0];

      if (!capital) {
        console.error("Country does not have a capital:", randomCountry);
        return;
      }

      setQuestion(`The capital of ${countryName} is:`);
      setCorrectAnswer(capital);

      const otherCapitals = countries
        .filter((country) => country.capital && country.capital[0] !== capital)
        .map((country) => country.capital && country.capital[0])
        .filter((capital) => capital)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      setIncorrectAnswers(otherCapitals);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isQuizActive) {
      fetchRandomQuestion();
      // Uruchamiamy timer na 33 sekundy
      timerRef.current = setTimeout(() => {
        setIsQuizActive(false);
        clearTimeout(timerRef.current); // Czyścimy timer
      }, 33000); // 33 sekundy w milisekundach
    }
  }, [isQuizActive]);

  const handleAnswerClick = (answer) => {
    setIsAnswered(true);
    if (answer === correctAnswer) {
      setIsCorrectAnswer(true);
      setScore((prevScore) => prevScore + 1); // Zwiększamy wynik o 1
    } else {
      setIsCorrectAnswer(false);
    }
    setTimeout(() => {
      setIsAnswered(false);
      setIsCorrectAnswer(null);
      fetchRandomQuestion();
    }, 500); // Opóźnienie zmiany pytania o pół sekundy
  };

  const combinedAnswers = [correctAnswer, ...incorrectAnswers]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="Quiz">
      {isQuizActive && <h1>{question}</h1>}
      {!isQuizActive && (
        <div>
          <h2>Score: {score}</h2>
          <button onClick={onTryAgain} className="play-button try-again">
            Try Again
          </button>
        </div>
      )}
      <div className="answers">
        {isQuizActive &&
          combinedAnswers.map((answer) => (
            <button
              key={answer}
              onClick={() => handleAnswerClick(answer)}
              className={
                `answer-button ${
                  isAnswered && answer === correctAnswer
                    ? "correct"
                    : "" /* Dodajemy warunek dla poprawnej odpowiedzi */
                }${
                  isAnswered && !isCorrectAnswer && answer === correctAnswer
                    ? " incorrect"
                    : ""
                }` /* Dodajemy warunek dla niepoprawnej odpowiedzi */
              }
              disabled={
                isAnswered
              } /* Dezaktywujemy przyciski po udzieleniu odpowiedzi */
            >
              {answer}
            </button>
          ))}
      </div>
    </div>
  );
}

export default Quiz;
