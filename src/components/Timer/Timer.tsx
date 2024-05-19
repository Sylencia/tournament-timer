import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./Timer.scss";
import clsx from "clsx";
import { PrefsContext } from "../../PrefsContext";
import { ISavedEvent, defaultSavedEvent } from "../../interfaces";
import {
  Cross2Icon,
  DoubleArrowRightIcon,
  PauseIcon,
  PlayIcon,
} from "@radix-ui/react-icons";

interface ITimerProps {
  storageId: string;
  onEventFinish: () => void;
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

export const Timer = ({ storageId, onEventFinish }: ITimerProps) => {
  const { mode } = useContext(PrefsContext);

  // Event State
  const [eventDetails, setEventDetails] =
    useState<ISavedEvent>(defaultSavedEvent);
  // Timer State
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("timerTick", handleTimerTick);

    return () => window.removeEventListener("timerTick", handleTimerTick);
  });

  const handleTimerTick = useCallback(() => {
    if (isRunning) {
      setTimeRemaining((time) => time - 1);
      if (timeRemaining === 0) {
        console.log("Finished");
      }
    }
  }, [isRunning, timeRemaining]);

  const parseTimerDetails = useCallback((details: ISavedEvent) => {
    setIsRunning(details.isRunning);
    if (!details.isRunning) {
      setTimeRemaining(details.timeRemaining);
    } else {
      const currentTime = Math.floor(Date.now() / 1000);
      setTimeRemaining(details.endTime - currentTime);
    }
  }, []);

  useEffect(() => {
    const item = localStorage.getItem(storageId);
    if (item) {
      const parsed: ISavedEvent = JSON.parse(item);
      setEventDetails(parsed);
      parseTimerDetails(parsed);
    }
  }, [storageId, parseTimerDetails]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageId && event.newValue) {
        const parsed: ISavedEvent = JSON.parse(event.newValue);
        setEventDetails(parsed);
        parseTimerDetails(parsed);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageId, parseTimerDetails]);

  const subtitle = useMemo(() => {
    let result = "Draft Round";
    if (eventDetails.currentRound > 0) {
      result =
        eventDetails.rounds === 1
          ? ""
          : `Round ${eventDetails.currentRound}/${eventDetails.rounds}`;
    }

    return result;
  }, [eventDetails]);

  const updateEventDetails = useCallback(
    (details: ISavedEvent) => {
      setEventDetails(details);
      localStorage.setItem(storageId, JSON.stringify(details));
    },
    [setEventDetails, storageId]
  );

  // Timer Functionality
  const start = useCallback(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = currentTime + timeRemaining;
    setIsRunning(true);

    const item: ISavedEvent = {
      ...eventDetails,
      endTime,
      isRunning: true,
    };

    updateEventDetails(item);
  }, [timeRemaining, eventDetails, updateEventDetails]);

  const pause = useCallback(() => {
    setIsRunning(false);

    const item: ISavedEvent = {
      ...eventDetails,
      isRunning: false,
      timeRemaining,
    };

    updateEventDetails(item);
  }, [eventDetails, timeRemaining, updateEventDetails]);

  const nextRound = useCallback(() => {
    setTimeRemaining(eventDetails.roundTime);
    setIsRunning(false);

    const item: ISavedEvent = {
      ...eventDetails,
      isRunning: false,
      timeRemaining: eventDetails.roundTime,
      currentRound: eventDetails.currentRound + 1,
    };

    updateEventDetails(item);
  }, [eventDetails, updateEventDetails]);

  return (
    <div className={clsx("timer-container", { "view-mode": mode === "view" })}>
      <div className="title">{eventDetails.eventName}</div>
      <div className="subtitle">{subtitle}</div>
      <div className={clsx("timer", { overtime: timeRemaining < 0 })}>
        {formatTime(timeRemaining)}
      </div>
      {mode === "edit" && (
        <div className="controls">
          <button onClick={() => (isRunning ? pause() : start())}>
            {isRunning ? (
              <>
                <PauseIcon />
                <div>Pause</div>
              </>
            ) : (
              <>
                <PlayIcon />
                <div>Start</div>
              </>
            )}
          </button>
          {eventDetails.currentRound !== eventDetails.rounds ? (
            <button onClick={() => nextRound()}>
              <>
                <DoubleArrowRightIcon />
                <div>Next Round</div>
              </>
            </button>
          ) : null}
          <button className="finish-button" onClick={onEventFinish}>
            <>
              <Cross2Icon />
              <div>Finish Event</div>
            </>
          </button>
        </div>
      )}
    </div>
  );
};
