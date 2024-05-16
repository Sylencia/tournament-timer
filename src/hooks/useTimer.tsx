import { useCallback, useEffect, useState } from "react";
import { useInterval } from "./useInterval";
import { ISavedEvent } from "../components/Event";

interface useTimerProps {
  timerLength: number;
  onFinish: () => void;
  storageId: string;
}

const INTERVAL_DELAY = 1000;

export const useTimer = ({
  timerLength,
  onFinish,
  storageId,
}: useTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(timerLength);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const parseStoredValues = useCallback((item: string) => {
    const parsed: ISavedEvent = JSON.parse(item);
    setIsRunning(parsed.isRunning);
    if (!parsed.isRunning) {
      setTimeRemaining(parsed.timeRemaining);
    } else {
      const currentTime = Math.floor(Date.now() / 1000);
      setTimeRemaining(parsed.endTime - currentTime);
    }
  }, []);

  useEffect(() => {
    const item = localStorage.getItem(storageId);
    if (item) {
      parseStoredValues(item);
    }
  }, [storageId, parseStoredValues]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageId && event.newValue) {
        parseStoredValues(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageId, parseStoredValues]);

  const handleFinish = useCallback(() => {
    onFinish();
  }, [onFinish]);

  const start = useCallback(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = currentTime + timeRemaining;
    setIsRunning(true);

    const item: ISavedEvent = {
      ...JSON.parse(localStorage.getItem(storageId)!),
      endTime,
      isRunning: true,
    };

    localStorage.setItem(storageId, JSON.stringify(item));
  }, [storageId, timeRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);

    const item: ISavedEvent = {
      ...JSON.parse(localStorage.getItem(storageId)!),
      isRunning: false,
      timeRemaining,
    };

    localStorage.setItem(storageId, JSON.stringify(item));
  }, [storageId, timeRemaining]);

  const restart = useCallback(
    (newLength?: number) => {
      if (newLength) {
        setTimeRemaining(newLength);
      } else {
        setTimeRemaining(timerLength);
      }

      setIsRunning(false);

      const item: ISavedEvent = {
        ...JSON.parse(localStorage.getItem(storageId)!),
        isRunning: false,
        timeRemaining: newLength ?? timerLength,
      };

      localStorage.setItem(storageId, JSON.stringify(item));
    },
    [timerLength, storageId]
  );

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
    restart,
    isRunning,
  };
};
