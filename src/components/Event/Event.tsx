import { useContext, useEffect, useState } from "react";
import { AddEvent } from "../AddEvent";
import { EventSetup } from "../EventSetup";
import { Timer } from "../Timer";
import { ModeContext } from "../../ModeContext";
import { ISavedEvent, defaultSavedEvent } from "../../interfaces";

interface IEventProps {
  id: number;
}

type EventState = "add" | "setup" | "timer";

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
      localStorage.setItem(storageId, JSON.stringify(defaultSavedEvent));
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

      localStorage.setItem(storageId, JSON.stringify(defaultSavedEvent));
    }
  };

  const resetEventState = () => {
    setEventState("add");

    localStorage.setItem(storageId, JSON.stringify(defaultSavedEvent));
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
