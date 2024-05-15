import { useContext } from "react";
import "./Header.scss";
import { ModeContext } from "../../ModeContext";

export const Header = () => {
  const { mode, toggleMode } = useContext(ModeContext);

  return (
    <header className="header">
      <h3>Tournament Timer</h3>
      <button onClick={toggleMode}>
        {mode === "view" ? "Set to Edit" : "Set to View"}
      </button>
    </header>
  );
};
