import { useEffect, useState } from "react";
import "./Footer.scss";

const getCurrentTimeString = (): string => {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes}${ampm}`;
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
