import { useEffect, useState } from "react";
import "./Footer.scss";

const getCurrentTimeString = (): string => {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const timeString = `${hours}:${minutes}`;
  return timeString;
};

export const Footer = () => {
  const [currentTime, setCurrentTime] = useState<string>(
    getCurrentTimeString()
  );

  const updateTime = (): void => {
    setCurrentTime(getCurrentTimeString());
  };

  useEffect(() => {
    window.addEventListener("timerTick", updateTime);

    return () => window.removeEventListener("timerTick", updateTime);
  });

  return (
    <footer className="footer-container">
      <div className="label">Store Time</div>
      <div className="current-time">{currentTime}</div>
    </footer>
  );
};
