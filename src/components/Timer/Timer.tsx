import { useState } from "react";
import "./Timer.scss";
import { useTimer } from "../../hooks/useTimer";

interface TimerTypes {
  id: number;
  readOnly: boolean;
}

const formatTime = (seconds: number): string => {
  const sign = seconds < 0 ? "-" : "";
  const absSeconds = Math.abs(seconds);
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const remainingSeconds = absSeconds % 60;

  let formattedString = sign;
  if (hours > 0) {
    formattedString += `${hours}:`;
  }
  formattedString += `${String(minutes).padStart(2, "0")}:`;
  formattedString += String(remainingSeconds).padStart(2, "0");

  return formattedString;
};

export const Timer = ({ id, readOnly }: TimerTypes) => {
  const [title, setTitle] = useState<string>("Magic the Gathering Standard");
  const [subtitle, setSubtitle] = useState<string>("Round 1/3");

  const { timeRemaining, start, pause, isRunning } = useTimer({
    timerLength: 10,
    onFinish: () => {},
    timerId: id.toString(),
  });

  const containerClass = readOnly ? "container read-only" : "container";

  return (
    <div className={containerClass}>
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
      <div className="timer">{formatTime(timeRemaining)}</div>
      {!readOnly && (
        <div className="controls">
          <button onClick={start}>Start</button>
          <button onClick={pause}>Pause</button>
        </div>
      )}
    </div>
  );
};
