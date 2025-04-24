"use client";

import React from "react";
import dynamic from "next/dynamic";
import { theme } from "@/constants/theme";

// Importa el componente de Lottie solo en el cliente
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "../lotties/loading_v4.json";

const LoadingModal = () => {
  if (typeof window === "undefined") return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <Lottie
        animationData={animationData}
        className="flex justify-center items-center"
        style={{
          width: "300px",
          height: "300px",
          opacity: 0.8,
          borderRadius: theme.buttonRadios.l,
        }}
        loop={true}
        speed={2}
      />
    </div>
  );
};

export default LoadingModal;
