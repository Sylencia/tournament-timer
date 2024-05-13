import { Dispatch, SetStateAction } from "react";
import "./Header.scss";

interface HeaderProps {
  readOnly: boolean;
  setReadOnly: Dispatch<SetStateAction<boolean>>;
}

export const Header = ({ readOnly, setReadOnly }: HeaderProps) => {
  return (
    <header className="header">
      <h3>Tournament Timer</h3>
      <button onClick={() => setReadOnly(!readOnly)}>
        {readOnly ? "Set to Edit" : "Set to Read Only"}
      </button>
    </header>
  );
};
