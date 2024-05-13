import { useCallback, useEffect, useState } from "react";
import { useInterval } from "./useInterval";

interface useTimerProps {
  timerLength: number;
  onFinish: () => void;
  timerId: string;
}

interface RunningTimerStorage {
  isRunning: true;
  endTime: number;
}

interface PausedTimerStorage {
  isRunning: false;
  timeRemaining: number;
}

type TimerStorage = RunningTimerStorage | PausedTimerStorage;

const INTERVAL_DELAY = 1000;

export const useTimer = ({ timerLength, onFinish, timerId }: useTimerProps) => {
  const id = `${timerId}_timer`;
  const [timeRemaining, setTimeRemaining] = useState<number>(timerLength);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const parseStoredValues = useCallback((item: string) => {
    const parsed: TimerStorage = JSON.parse(item);
    setIsRunning(parsed.isRunning);
    if (!parsed.isRunning) {
      setTimeRemaining(parsed.timeRemaining);
    } else {
      const currentTime = Math.floor(Date.now() / 1000);
      setTimeRemaining(parsed.endTime - currentTime);
    }
  }, []);

  useEffect(() => {
    const item = localStorage.getItem(id);
    if (item) {
      parseStoredValues(item);
    }
  }, [id, parseStoredValues]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === id && event.newValue) {
        parseStoredValues(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [id, parseStoredValues]);

  const handleFinish = useCallback(() => {
    onFinish();
  }, [onFinish]);

  const start = useCallback(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = currentTime + timeRemaining;
    setIsRunning(true);

    const item: RunningTimerStorage = {
      endTime,
      isRunning: true,
    };

    localStorage.setItem(`${timerId}_timer`, JSON.stringify(item));
  }, [timerId, timeRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);

    const item: PausedTimerStorage = {
      isRunning: false,
      timeRemaining,
    };

    localStorage.setItem(`${timerId}_timer`, JSON.stringify(item));
  }, [timerId, timeRemaining]);

  useInterval(
    () => {
      setTimeRemaining((time) => time - 1);
      if (timeRemaining <= 0) {
        handleFinish();
      }
    },
    isRunning ? INTERVAL_DELAY : null
  );

  return {
    timeRemaining,
    start,
    pause,
    isRunning,
  };
};
