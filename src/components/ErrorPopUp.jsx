"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/constants/theme";

const ErrorPopUp = ({ message, path }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <h3
          className="text-xl mb-4"
          style={{
            color: theme.palette.text.hex,
            fontWeight: theme.fontWeight.semibold,
          }}
        >
          {message}
        </h3>
        <button
          onClick={() => {
            router.push(path || router.back());
          }}
          className="mt-4 px-6 py-2 rounded-lg text-white w-full"
          style={{ backgroundColor: theme.palette.complementary.hex }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ErrorPopUp;
