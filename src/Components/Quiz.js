import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Quiz.css"; 
import Lifelines from "./Lifelines";

function Quiz({ onTryAgain, topScore, difficulty }) {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null); 
  const [score, setScore] = useState(0); 
  const [isQuizActive, setIsQuizActive] = useState(true);
  const [buttonsOrder, setButtonsOrder] = useState([]); 
  const timerRef = useRef(null); 

  const difficultyLevels = {
    easy: { time: 15 }, // Dla poziomu łatwego, 30 sekund na odpowiedź
    medium: { time: 10 }, // Dla poziomu średniego, 20 sekund na odpowiedź
    hard: { time: 5 } // Dla poziomu trudnego, 10 sekund na odpowiedź
  };

  const [timeLeft, setTimeLeft] = useState(difficultyLevels[difficulty].time); 

  const fetchRandomQuestion = async () => {
    try {

      // Pobieranie losowych państw z API
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

      // Ustawianie kolejności przycisków tylko raz po pobraniu nowego pytania
      setButtonsOrder(shuffleArray([...incorrect, capital]));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUseLifeline = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const countries = response.data;
  
      // Szukamy kraju, który odpowiada poprawnej odpowiedzi
      const correctCountry = countries.find((country) => country.capital && country.capital[0] === correctAnswer);
  
      // Jeśli znaleźliśmy kraj, wyświetlamy jego nazwę w wyskakującym okienku
      if (correctCountry) {
        alert(`Poprawna odpowiedź to: ${correctAnswer}`);
      } else {
        alert("Nie udało się znaleźć poprawnej odpowiedzi.");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error);
      alert("Wystąpił błąd podczas pobierania danych.");
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
      // Uruchamiamy timer na czas odpowiadający wybranemu poziomowi trudności
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

    return () => clearInterval(timerRef.current); // Czyszczenie interwału przy odmontowywaniu komponentu
  }, [isQuizActive]);

  const handleAnswerClick = (answer) => {
    if (!isAnswered) {
      setIsAnswered(true);
      if (answer === correctAnswer) {
        setIsCorrectAnswer(true);
        setScore((prevScore) => prevScore + 1); // Zwiększanie wyniku o 1
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
      {/* Dodajemy komponent Lifelines */}
      {isQuizActive && <Lifelines onUseLifeline={handleUseLifeline} />}
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
