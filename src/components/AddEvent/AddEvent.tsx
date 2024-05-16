import "./AddEvent.scss";

interface IAddEventProps {
  onAddEvent: () => void;
}

export const AddEvent = ({ onAddEvent }: IAddEventProps) => {
  return (
    <button className="add-event" onClick={onAddEvent}>
      +
    </button>
  );
};
