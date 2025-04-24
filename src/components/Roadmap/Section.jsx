"use client";

import React from "react";
import Image from "next/image";
import { theme } from "@/constants/theme";

const Section = ({ sectionName, sectionData, onClick }) => {
  const allTasksDone = Object.values(sectionData)
    .slice(1)
    .every((task) => task.status === "done");

  return (
    <div
      className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md cursor-pointer"
      style={{
        borderColor: theme.palette.light.hex,
        fontFamily: "Montserrat, sans-serif",
      }}
      onClick={onClick}
    >
      {allTasksDone ? (
        <Image src={`/si.png`} alt={sectionName} width={40} height={40} />
      ) : (
        <Image
          src={`/icons/${sectionData[Object.keys(sectionData)[1]].skill}.png`}
          alt={sectionName}
          width={40}
          height={40}
        />
      )}
    </div>
  );
};

export default Section;
