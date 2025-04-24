import React, { useEffect, useState } from "react";
import "@fontsource/montserrat";
import { theme } from "@/constants/theme";

const ProgressBar = ({ progress }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);

    console.log(progress);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-6 relative">
      <div
        className="h-6 rounded-full transition-all duration-500"
        style={{
          width: `${animatedProgress}%`,
          background:
            "linear-gradient(90deg, rgb(5, 0, 105) 0%, rgb(16, 9, 121) 37%, rgb(4, 0, 221) 100%)",
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-6">
        <div
          className="absolute top-0 left-1/4 transform -translate-x-1/2"
          style={{ width: "2px", height: "100%", backgroundColor: "gray" }}
        ></div>
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{ width: "2px", height: "100%", backgroundColor: "gray" }}
        ></div>
        <div
          className="absolute top-0 left-3/4 transform -translate-x-1/2"
          style={{ width: "2px", height: "100%", backgroundColor: "gray" }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
