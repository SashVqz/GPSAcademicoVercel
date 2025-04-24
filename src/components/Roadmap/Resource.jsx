"use client";

import React from "react";
import { theme } from "@/constants/theme";

const Resource = ({ resource }) => {
  return (
    <div className="flex justify-center items-center mt-4">
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: theme.palette.primary.hex,
          fontSize: theme.fontSizes.m,
        }}
        className="hover:underline text-center"
      >
        {resource.description}
      </a>
    </div>
  );
};

export default Resource;
