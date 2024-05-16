import { useContext, useEffect, useState } from "react";
import { AddEvent } from "../AddEvent";
import { EventSetup } from "../EventSetup";
import { Timer } from "../Timer";
import { ModeContext } from "../../ModeContext";

interface IEventProps {
  id: number;
}

export interface ISavedEvent {
  showTimer: boolean;
  eventName: string;
  rounds: number;
  roundTime: number;
  hasDraft: boolean;
  draftTime: number;
  currentRound: number;
  timerLength: number;
  endTime: number;
  isRunning: boolean;
  timeRemaining: number;
}

type EventState = "add" | "setup" | "timer";

const defaultItem: ISavedEvent = {
  showTimer: false,
  eventName: "",
  rounds: 0,
  roundTime: 0,
  hasDraft: false,
  draftTime: 0,
  currentRound: 0,
  timerLength: 0,
  endTime: 0,
  isRunning: false,
  timeRemaining: 0,
};

export const Event = ({ id }: IEventProps) => {
  const { mode } = useContext(ModeContext);
  const [eventState, setEventState] = useState<EventState>("add");
  const storageId = `event_${id}_info`;

  useEffect(() => {
    const item = localStorage.getItem(storageId);
    if (item) {
      const parsed: ISavedEvent = JSON.parse(item);
      setEventState(parsed.showTimer ? "timer" : "add");
    } else {
      localStorage.setItem(storageId, JSON.stringify(defaultItem));
    }
  }, [storageId]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageId && event.newValue) {
        const parsed: ISavedEvent = JSON.parse(event.newValue);
        setEventState(parsed.showTimer ? "timer" : "add");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageId]);

  const progressEventState = () => {
    if (eventState === "add") {
      setEventState("setup");
    }

    if (eventState === "setup") {
      setEventState("timer");

      const item = localStorage.getItem(storageId);
      if (item) {
        const parsed: ISavedEvent = JSON.parse(item);
        const newItem: ISavedEvent = {
          ...parsed,
          showTimer: true,
        };
        localStorage.setItem(storageId, JSON.stringify(newItem));
      }
    }

    if (eventState === "timer") {
      setEventState("add");

      localStorage.setItem(storageId, JSON.stringify(defaultItem));
    }
  };

  const resetEventState = () => {
    setEventState("add");

    localStorage.setItem(storageId, JSON.stringify(defaultItem));
  };

  const showAdd = eventState === "add" && mode === "edit";
  const showSetup = eventState === "setup" && mode === "edit";

  return (
    <>
      {showAdd && <AddEvent onAddEvent={progressEventState} />}
      {showSetup && (
        <EventSetup
          storageId={storageId}
          onSetupCancel={resetEventState}
          onSetupSubmit={progressEventState}
        />
      )}
      {eventState === "timer" && <Timer storageId={storageId} />}
    </>
  );
};
