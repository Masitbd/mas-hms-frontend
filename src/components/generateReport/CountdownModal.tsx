"use client";

import React, { useEffect, useState } from "react";

interface CountdownModalProps {
  seconds: number;
  message: string;
}

const CountdownModal: React.FC<CountdownModalProps> = ({
  seconds,
  message,
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  console.log(seconds);
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timerId); // Cleanup timer on unmount
    }
  }, [timeLeft]);

  return timeLeft > 0 ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Ensure it's in front of all content
        fontSize: "2rem",
        fontFamily: "sans-serif",
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <p>{message}</p>
      <p>{timeLeft} seconds left</p>
    </div>
  ) : null;
};

export default CountdownModal;
