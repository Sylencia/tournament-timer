import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Timer.scss";
import clsx from "clsx";
import { PrefsContext } from "../../PrefsContext";
import { ISavedEvent, defaultSavedEvent } from "../../interfaces";
import {
  ClockIcon,
  Cross2Icon,
  DoubleArrowDownIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  DoubleArrowUpIcon,
  PauseIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import chime from "./Chime.mp3";

interface ITimerProps {
  storageId: string;
  onEventFinish: () => void;
}

const formatTime = (milliseconds: number): string => {
  const sign = milliseconds < 0 ? "-" : "";
  const seconds = Math.round(milliseconds / 1000);
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
  const [roundEnded, setRoundEnded] = useState<boolean>(false);
  // Audio
  const audioRef = useRef<HTMLAudioElement>(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    window.addEventListener("timerTick", handleTimerTick);

    return () => window.removeEventListener("timerTick", handleTimerTick);
  });

  const handleTimerTick = useCallback(() => {
    if (isRunning) {
      setTimeRemaining(eventDetails.endTime - Date.now());
      if (timeRemaining <= 0 && !roundEnded) {
        setRoundEnded(true);
        playSound();
      }
    }
  }, [isRunning, timeRemaining, eventDetails, roundEnded]);

  const parseTimerDetails = useCallback((details: ISavedEvent) => {
    setIsRunning(details.isRunning);
    if (!details.isRunning) {
      setTimeRemaining(details.timeRemaining);
    } else {
      setTimeRemaining(details.endTime - Date.now());
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
    const endTime = Date.now() + timeRemaining;
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

  const addTime = useCallback(
    (minutes: number) => {
      const newTimeRemaining = timeRemaining + minutes * 60000;
      setTimeRemaining(newTimeRemaining);
      const newEndTime = eventDetails.endTime + minutes * 60000;

      const item: ISavedEvent = {
        ...eventDetails,
        timeRemaining,
        endTime: newEndTime,
      };

      updateEventDetails(item);
    },
    [timeRemaining, eventDetails, updateEventDetails]
  );

  const addRound = useCallback(
    (addedRounds: number) => {
      const item: ISavedEvent = {
        ...eventDetails,
        timeRemaining,
        rounds: eventDetails.rounds + addedRounds,
      };

      updateEventDetails(item);
    },
    [timeRemaining, eventDetails, updateEventDetails]
  );

  const nextRound = useCallback(() => {
    setTimeRemaining(eventDetails.roundTime);
    setIsRunning(false);
    setRoundEnded(false);

    const item: ISavedEvent = {
      ...eventDetails,
      isRunning: false,
      timeRemaining: eventDetails.roundTime,
      currentRound: eventDetails.currentRound + 1,
    };

    updateEventDetails(item);
  }, [eventDetails, updateEventDetails]);

  const previousRound = useCallback(() => {
    const newRound = eventDetails.currentRound - 1;
    const newTimeRemaining =
      newRound === 0 ? eventDetails.draftTime : eventDetails.roundTime;

    setTimeRemaining(newTimeRemaining);
    setIsRunning(false);
    setRoundEnded(false);

    const item: ISavedEvent = {
      ...eventDetails,
      isRunning: false,
      timeRemaining: newTimeRemaining,
      currentRound: newRound,
    };

    updateEventDetails(item);
  }, [eventDetails, updateEventDetails]);

  return (
    <div className={clsx("timer-container", { "view-mode": mode === "view" })}>
      <audio ref={audioRef} src={chime} />
      <div className="title">{eventDetails.eventName}</div>
      <div className="subtitle">{subtitle}</div>
      <div className={clsx("timer", { overtime: timeRemaining < 0 })}>
        {formatTime(timeRemaining)}
      </div>
      {mode === "edit" && (
        <div className="control-container">
          <div className="controls">
            <button onClick={() => addTime(-1)}>
              <>
                <ClockIcon />
                <div>-1 minute</div>
              </>
            </button>
            <button onClick={() => addTime(1)}>
              <>
                <ClockIcon />
                <div>+1 minute</div>
              </>
            </button>
            <button
              onClick={() => addRound(-1)}
              disabled={
                eventDetails.rounds === 1 ||
                eventDetails.currentRound === eventDetails.rounds
              }
            >
              <>
                <DoubleArrowDownIcon />
                <div>Remove Round</div>
              </>
            </button>
            <button onClick={() => addRound(1)}>
              <>
                <DoubleArrowUpIcon />
                <div>Add Round</div>
              </>
            </button>
          </div>

          <div className="controls">
            <button
              onClick={() => (isRunning ? pause() : start())}
              className={clsx({
                "start-button": !isRunning,
                "pause-button": isRunning,
              })}
            >
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
            <button
              onClick={() => previousRound()}
              disabled={
                (eventDetails.hasDraft && eventDetails.currentRound === 0) ||
                (!eventDetails.hasDraft && eventDetails.currentRound === 1)
              }
            >
              <>
                <DoubleArrowLeftIcon />
                <div>Previous Round</div>
              </>
            </button>
            <button
              onClick={() => nextRound()}
              disabled={eventDetails.currentRound === eventDetails.rounds}
            >
              <>
                <DoubleArrowRightIcon />
                <div>Next Round</div>
              </>
            </button>
            <button className="finish-button" onClick={onEventFinish}>
              <>
                <Cross2Icon />
                <div>Finish Event</div>
              </>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
