import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Quiz.css"; 
import Lifelines from "./Lifelines";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


function CustomModal({ message, onClose }) {
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Thank you!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function Quiz({ onTryAgain, topScore, difficulty }) {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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
    easy: { time: 15 }, 
    medium: { time: 10 }, 
    hard: { time: 5 } 
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
      if (correctAnswer) {
        setModalMessage(`The correct answer is: ${correctAnswer}`);
        setShowModal(true);
      } else {
        console.log("The correct answer has not been set yet.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setModalMessage("An error occurred while fetching data.");
      setShowModal(true);
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
      {showModal && (
      <CustomModal message={modalMessage} onClose={() => setShowModal(false)} />
    )}
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
