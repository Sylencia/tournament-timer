import { ChangeEvent, useCallback, useState } from "react";
import "./EventSetup.scss";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ISavedEvent } from "../Event";

interface IEventDetails {
  eventName: string | undefined;
  rounds: string | undefined;
  roundTime: string | undefined;
  hasDraft: boolean;
  draftTime: string | undefined;
}

interface IEventDetailsValidation {
  eventName: boolean;
  rounds: boolean;
  roundTime: boolean;
  draftTime: boolean;
}
interface IEventSetupProps {
  storageId: string;
  onSetupSubmit: () => void;
  onSetupCancel: () => void;
}

const defaultEventDetails: IEventDetails = {
  eventName: undefined,
  rounds: undefined,
  roundTime: undefined,
  hasDraft: false,
  draftTime: undefined,
};

const defaultValidation: IEventDetailsValidation = {
  eventName: true,
  rounds: true,
  roundTime: true,
  draftTime: true,
};

const validateText = (str: string | undefined): boolean =>
  str !== undefined && str.length > 0;

const validateNumber = (str: string | undefined): boolean => {
  if (str === undefined) {
    return false;
  }

  const num = Number(str);
  return !isNaN(num) && num > 0;
};

export const EventSetup = ({
  storageId,
  onSetupSubmit,
  onSetupCancel,
}: IEventSetupProps) => {
  const [eventDetails, setEventDetails] =
    useState<IEventDetails>(defaultEventDetails);

  const [detailsValidation, setDetailsValidation] =
    useState<IEventDetailsValidation>(defaultValidation);

  const eventDetailsTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, field: keyof IEventDetails) =>
      setEventDetails((prev: IEventDetails) => ({
        ...prev,
        [field]: e.target.value,
      })),
    [setEventDetails]
  );

  const eventDetailsCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, field: keyof IEventDetails) =>
      setEventDetails((prev: IEventDetails) => ({
        ...prev,
        [field]: e.target.checked,
      })),
    [setEventDetails]
  );

  const attemptSubmit = useCallback(() => {
    const validation = Object.assign({}, defaultValidation);

    validation.eventName = validateText(eventDetails.eventName);
    validation.rounds = validateNumber(eventDetails.rounds);
    validation.roundTime = validateNumber(eventDetails.roundTime);
    validation.draftTime =
      !eventDetails.hasDraft || validateNumber(eventDetails.draftTime);

    // Check for any false values. If there are none, submit.
    if (!Object.values(validation).some((val) => !val)) {
      const item = localStorage.getItem(storageId);
      const { eventName, hasDraft, draftTime, rounds, roundTime } =
        eventDetails;
      const convertedDraftTime = Number(draftTime ?? 0) * 60;
      const convertedRoundTime = Number(roundTime) * 60;
      if (item) {
        const parsed: ISavedEvent = JSON.parse(item);
        const newItem: ISavedEvent = {
          ...parsed,
          eventName: eventName ?? "",
          hasDraft: hasDraft,
          draftTime: convertedDraftTime,
          rounds: Number(rounds),
          roundTime: convertedRoundTime,
          timeRemaining: hasDraft ? convertedDraftTime : convertedRoundTime,
          currentRound: hasDraft ? 0 : 1,
        };

        localStorage.setItem(storageId, JSON.stringify(newItem));
      }

      onSetupSubmit();
    } else {
      setDetailsValidation(validation);
    }
  }, [eventDetails, onSetupSubmit, storageId]);

  return (
    <div className="event-setup-container">
      {detailsValidation.draftTime}
      <div className="eventName eventDetail">
        <div className={clsx("title", { error: !detailsValidation.eventName })}>
          Event Name
        </div>
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            eventDetailsTextChange(e, "eventName")
          }
          value={eventDetails.eventName}
          type="text"
        ></input>
      </div>
      <div className="hasDraft eventDetail">
        <div className="checkbox-title">Include Draft Round?</div>
        <div className="checkbox-section">
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              eventDetailsCheckboxChange(e, "hasDraft")
            }
            checked={eventDetails.hasDraft}
            type="checkbox"
          ></input>
        </div>
      </div>
      <div
        className={clsx("draftTime", "eventDetail", {
          disabled: !eventDetails.hasDraft,
        })}
      >
        <div className={clsx("title", { error: !detailsValidation.draftTime })}>
          Draft Time
        </div>
        <div className="input-with-label">
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              eventDetailsTextChange(e, "draftTime")
            }
            value={eventDetails.draftTime}
            type="text"
            disabled={!eventDetails.hasDraft}
          ></input>
          <div className="label">mins</div>
        </div>
      </div>
      <div className="rounds eventDetail">
        <div
          className={clsx("title", {
            error: !detailsValidation.rounds,
          })}
        >
          Rounds
        </div>
        <div className="input-with-label">
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              eventDetailsTextChange(e, "rounds")
            }
            value={eventDetails.rounds}
            type="text"
          ></input>
          <div className="label">rounds</div>
        </div>
      </div>
      <div className="roundTime eventDetail">
        <div className={clsx("title", { error: !detailsValidation.roundTime })}>
          Round Time
        </div>
        <div className="input-with-label">
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              eventDetailsTextChange(e, "roundTime")
            }
            value={eventDetails.roundTime}
            type="text"
          ></input>
          <div className="label">mins</div>
        </div>
      </div>
      <div className="buttons">
        <button className="submit" onClick={attemptSubmit}>
          <CheckIcon />
        </button>
        <button className="cancel" onClick={onSetupCancel}>
          <Cross2Icon />
        </button>
      </div>
    </div>
  );
};
