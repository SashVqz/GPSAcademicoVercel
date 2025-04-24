"use client";

import React, { useState } from "react";
import { theme } from "@constants/theme";
import "@fontsource/montserrat";
import { testQuestions } from "@/constants/testQuestions";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";


const RoadmapTest = ({
  onSubmit,
  onSpecializationChange,
  initialSpecialization = "",
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showSpecializationModal, setShowSpecializationModal] = useState(false);
  const [recommendedSpecialization, setRecommendedSpecialization] =
    useState("");
  const [specialization, setSpecialization] = useState(initialSpecialization);

  const calculateSpecialization = (answers) => {
    const scoreMap = {
      frontend: 0,
      backend: 0,
      data: 0,
      ai: 0,
    };
  
    answers.forEach((value, i) => {
      const tag = testQuestions[i]?.tag;
      if (tag && scoreMap.hasOwnProperty(tag)) {
        scoreMap[tag] += Number.isFinite(value) ? value : 0;
      }
    });
  
    const sorted = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]);
    const top = sorted[0][0];
  
    switch (top) {
      case "frontend":
        return "Frontend Developer";
      case "backend":
        return "Backend Development";
      case "data":
        return "Data Analyst";
      case "ai":
        return "Artificial Intelligence";
      default:
        return "Frontend Developer";
    }
  };
  
  


  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const recommended = calculateSpecialization(answers);
    setRecommendedSpecialization(recommended);
    setSpecialization(recommended);
    setShowSpecializationModal(true);
  };

  const confirmSpecialization = () => {
    setShowSpecializationModal(false);
    onSubmit(specialization);
    if (onSpecializationChange) {
      onSpecializationChange(specialization);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start mt-20"
      style={{
        fontFamily: "Montserrat",
      }}
    >

      <h1
        className="text-3xl font-bold text-center"
        style={{
          color: theme.palette.primary.hex,
          fontFamily: "Montserrat",
        }}
      >
        Descubre tu roadmap ideal
      </h1>

      <p
      className="mt-2"
        style={{
          color: theme.palette.text.hex
        }}
      >
        Completa el test para definir el roadmap que mejor se adapta a ti
      </p>

      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg mt-12">

        {currentQuestion < testQuestions.length && (
          <div
            className="space-y-6 p-6 "
            style={{ minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-3 py-1 text-sm font-medium rounded-full shadow-sm bg-blue-100 text-blue-700">
                Pregunta {currentQuestion + 1} de {testQuestions.length}
              </span>
            </div>

            <p
              className="text-center text-lg font-semibold leading-relaxed flex-1 flex items-center justify-center text-wrap text-balance text-ellipsis"
              style={{ color: theme.palette.text.hex }}
            >
              {testQuestions[currentQuestion].text}
            </p>

            <div className="flex flex-col items-center gap-3 pt-2 w-full">
              <div className="flex justify-between w-full text-sm text-gray-500 px-1">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={answers[currentQuestion] || 0}
                onChange={(e) => handleAnswer(parseInt(e.target.value))}
                className="w-full accent-blue-500"
                style={{ borderRadius: theme.buttonRadios.m }}
              />
              <div
                className="text-xl font-bold"
                style={{ color: theme.palette.primary.hex }}
              >
                {answers[currentQuestion] || 0}
              </div>
            </div>
          </div>
        )}



        <div className="flex justify-between items-center mt-6">
          {currentQuestion > 0 ? (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 transition"
            >
              <FaArrowLeft />
              <span>Anterior</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentQuestion < testQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
            >
              <span>Siguiente</span>
              <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
            >
              <span>Enviar</span>
              <FaCheck />
            </button>
          )}
        </div>



      </div>

      {showSpecializationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Especialización recomendada
            </h2>

            <p className="text-center text-gray-700 mb-6">
              Según tus respuestas, te recomendamos:
              <br />
              <strong
                className="block mt-2 text-xl"
                style={{ color: theme.palette.primary.hex }}
              >
                {recommendedSpecialization}
              </strong>
            </p>

            <div className="mb-6">
              <p className="font-medium mb-2 text-sm text-gray-600">
                Puedes confirmar o elegir otra especialización:
              </p>
              <ul className="space-y-2">
                {[
                  "Frontend Developer",
                  "Backend Development",
                  "Artificial Intelligence",
                  "Data Analyst",
                ].map((spec) => (
                  <li key={spec}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="specialization"
                        value={spec}
                        checked={specialization === spec}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="accent-blue-600"
                      />
                      <span className="text-gray-800">{spec}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={confirmSpecialization}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoadmapTest;
