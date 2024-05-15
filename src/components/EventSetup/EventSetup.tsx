import { ChangeEvent, useState } from "react";
import "./EventSetup.scss";

interface IEventDetails {
  eventName: string | undefined;
  rounds: number | undefined;
  roundTime: number | undefined;
  hasDraft: boolean;
  draftTime: number | undefined;
}

const defaultEventDetails: IEventDetails = {
  eventName: undefined,
  rounds: undefined,
  roundTime: undefined,
  hasDraft: false,
  draftTime: undefined,
};

export const EventSetup = () => {
  const [eventDetails, setEventDetails] =
    useState<IEventDetails>(defaultEventDetails);

  const eventDetailsTextChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof IEventDetails
  ) =>
    setEventDetails((prev: IEventDetails) => ({
      ...prev,
      [field]: e.target.value,
    }));

  const eventDetailsCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof IEventDetails
  ) =>
    setEventDetails((prev: IEventDetails) => ({
      ...prev,
      [field]: e.target.checked,
    }));

  return (
    <div className="event-container">
      <div className="eventName eventDetail">
        <div className="title">Event Name</div>
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            eventDetailsTextChange(e, "eventName")
          }
          value={eventDetails.eventName}
          type="text"
        ></input>
      </div>
      <div className="rounds eventDetail">
        <div className="title">Rounds</div>
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
        <div className="title">Round Time</div>
        <div className="input-with-label">
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              eventDetailsTextChange(e, "roundTime")
            }
            value={eventDetails.roundTime}
            type="text"
          ></input>
          <div className="label">minutes</div>
        </div>
      </div>
      <div className="hasDraft eventDetail">
        <div className="title">Include Draft Round?</div>
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
      <div className="draftTime eventDetail">
        <div className="title">Draft Time</div>
        <div className="input-with-label">
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              eventDetailsTextChange(e, "draftTime")
            }
            value={eventDetails.draftTime}
            type="text"
          ></input>
          <div className="label">minutes</div>
        </div>
      </div>
      <div className="buttons">
        <button>Submit</button>
        <button>Cancel</button>
      </div>
    </div>
  );
};
