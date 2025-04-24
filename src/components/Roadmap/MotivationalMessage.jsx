import React from "react";
import { theme } from "@/constants/theme";

const MotivationalMessage = ({ progress }) => {
  const getMessage = () => {
    if (progress >= 100) return "¡Has completado todo el roadmap! ¡Enhorabuena!";
    if (progress >= 75) return "¡Estás muy cerca de lograrlo! ¡Sigue así!";
    if (progress >= 50) return "¡Ya llevas la mitad del camino!";
    if (progress >= 25) return "¡Buen trabajo! Ya has avanzado bastante.";
    if (progress > 0) return "¡Has comenzado bien, sigue avanzando!";
    return "¡Empieza tu recorrido y descubre tu potencial!";
  };

  return (
    <p className="text-center text-base font-medium mb-6" style={{ color: theme.palette.text.hex }}>
      {getMessage()}
    </p>
  );
};

export default MotivationalMessage;
