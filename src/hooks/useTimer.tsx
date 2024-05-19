import { useCallback, useEffect, useState } from "react";
import { ISavedEvent } from "../components/Event";

interface useTimerProps {
  timerLength: number;
  onFinish: () => void;
  storageId: string;
}

export const useTimer = ({
  timerLength,
  onFinish,
  storageId,
}: useTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(timerLength);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("timerTick", handleTimerTick);

    return () => window.removeEventListener("timerTick", handleTimerTick);
  });

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
    (newLength: number) => {
      if (newLength) {
        setTimeRemaining(newLength);
      }

      setIsRunning(false);

      const item: ISavedEvent = {
        ...JSON.parse(localStorage.getItem(storageId)!),
        isRunning: false,
        timeRemaining: newLength,
      };

      localStorage.setItem(storageId, JSON.stringify(item));
    },
    [storageId]
  );

  const handleTimerTick = () => {
    if (isRunning) {
      setTimeRemaining((time) => time - 1);
      if (timeRemaining === 0) {
        handleFinish();
      }
    }
  };

  return {
    timeRemaining,
    start,
    pause,
    restart,
    isRunning,
  };
};
