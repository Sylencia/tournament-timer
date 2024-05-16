import { useContext, useEffect, useState } from "react";
import "./Timer.scss";
import { useTimer } from "../../hooks/useTimer";
import clsx from "clsx";
import { ModeContext } from "../../ModeContext";
import { ISavedEvent } from "../Event";

interface ITimerProps {
  storageId: string;
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

export const Timer = ({ storageId }: ITimerProps) => {
  const { mode } = useContext(ModeContext);
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");

  useEffect(() => {
    const item = localStorage.getItem(storageId);
    if (item) {
      const parsed: ISavedEvent = JSON.parse(item);
      let subtitle = "Draft Round";
      if (parsed.currentRound > 0) {
        subtitle =
          parsed.rounds === 1
            ? ""
            : `Round ${parsed.currentRound}/${parsed.rounds}`;
      }

      setTitle(parsed.eventName);
      setSubtitle(subtitle);
    }
  }, [storageId]);

  const { timeRemaining, start, pause, isRunning, restart } = useTimer({
    timerLength: 10,
    onFinish: () => {},
    storageId,
  });

  return (
    <div className={clsx("timer-container", { "view-mode": mode === "view" })}>
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
      <div className={clsx("timer", { overtime: timeRemaining < 0 })}>
        {formatTime(timeRemaining)}
      </div>
      {mode === "edit" && (
        <div className="controls">
          <button onClick={() => (isRunning ? pause() : start())}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={() => restart(20)}>Restart</button>
        </div>
      )}
    </div>
  );
};
