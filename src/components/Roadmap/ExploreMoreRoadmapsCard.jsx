"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGlobe } from "react-icons/fa";
import { theme } from "@/constants/theme";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});

const ExploreMoreRoadmapsCard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (

    <>
      {loading && <LoadingModal />}

      <div
        className="flex flex-col items-center justify-center text-center space-y-4 p-8 rounded-2xl shadow-md transition hover:shadow-lg cursor-pointer"
        style={{
          backgroundColor: `${theme.palette.secondary.hex}15`,
          border: `1px dashed ${theme.palette.secondary.hex}`,
          fontFamily: "Montserrat",
        }}
        onClick={() => {
          setLoading(true);
          router.push("/exploreRoadmaps");
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}

      >
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full"
          style={{
            backgroundColor: theme.palette.secondary.hex,
          }}
        >
          <FaGlobe size={28} color="#fff" />
        </div>

        <h2
          className="text-xl font-bold"
          style={{
            color: theme.palette.secondary.hex,
          }}
        >
          ¿Te gustaría explorar más especializaciones?
        </h2>

        <p
          className="text-base"
          style={{
            color: theme.palette.text.hex,
          }}
        >
          Descubre todas las rutas disponibles y encuentra nuevas oportunidades de crecimiento.
        </p>

        <button
          className="px-6 py-2 rounded-full text-white font-semibold transition"
          style={{
            backgroundColor: theme.palette.primary.hex,
          }}
        >
          Ver Roadmaps
        </button>
      </div>
    </>

  );
};

export default ExploreMoreRoadmapsCard;
