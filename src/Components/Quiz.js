// Quiz.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Quiz.css"; // Zaimportuj plik CSS dla Quizu

function Quiz({ onTryAgain, topScore }) {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null); // Dodajemy stan dla sprawdzenia poprawności odpowiedzi
  const [score, setScore] = useState(0); // Dodajemy stan dla wyniku
  const [isQuizActive, setIsQuizActive] = useState(true); // Rozpoczynamy quiz automatycznie
  const [timeLeft, setTimeLeft] = useState(33); // Dodajemy stan dla czasu pozostałego na quiz
  const [buttonsOrder, setButtonsOrder] = useState([]); // Dodajemy stan dla kolejności przycisków
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

      const allCapitals = countries
        .filter((country) => country.capital && country.capital[0])
        .map((country) => country.capital[0]);

      const shuffledCapitals = shuffleArray([...allCapitals]);

      const incorrect = shuffledCapitals
        .filter((c) => c !== capital)
        .slice(0, 2);

      setIncorrectAnswers(incorrect);

      // Ustaw kolejność przycisków tylko raz po pobraniu nowego pytania
      setButtonsOrder(shuffleArray([...incorrect, capital]));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
    if (isQuizActive) {
      fetchRandomQuestion();
      // Uruchamiamy timer na 33 sekundy
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            clearInterval(timerRef.current);
            setIsQuizActive(false);
            return 0;
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000); // 1000ms = 1s
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current); // Clear the interval on component unmount
  }, [isQuizActive]);

  const handleAnswerClick = (answer) => {
    if (!isAnswered) {
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
    }
  };

  const buttons = buttonsOrder.map((answer) => (
    <button
      key={answer}
      onClick={() => handleAnswerClick(answer)}
      className={`answer-button ${
        isAnswered && answer === correctAnswer ? "correct" : ""
      }${
        isAnswered && !isCorrectAnswer && answer === correctAnswer
          ? " incorrect"
          : ""
      }`}
      disabled={isAnswered}
    >
      {answer}
    </button>
  ));

  useEffect(() => {
    if (!isQuizActive && score > topScore) {
      onTryAgain(score);
    }
  }, [isQuizActive, score, topScore, onTryAgain]);

  return (
    <div className="Quiz">
      {isQuizActive && <div className="timer">{timeLeft}</div>}
      {isQuizActive && <h1>{question}</h1>}
      {!isQuizActive && (
        <div>
          <h2>Score: {score}</h2>
          <button
            onClick={() => onTryAgain(score)}
            className="play-button try-again"
          >
            Try Again
          </button>
        </div>
      )}
      <div className="answers">{isQuizActive && buttons}</div>
    </div>
  );
}

export default Quiz;

