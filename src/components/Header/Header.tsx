import { useContext, useState } from "react";
import "./Header.scss";
import { PrefsContext } from "../../PrefsContext";
import { Cross2Icon, EyeOpenIcon, Pencil2Icon } from "@radix-ui/react-icons";

export const Header = () => {
  const { mode, toggleMode, toggleHeader } = useContext(PrefsContext);
  const [modeHover, setModeHover] = useState<boolean>(false);
  const [closeHover, setCloseHover] = useState<boolean>(false);

  return (
    <header className="header-container">
      <h3>Tournament Timer</h3>
      <div className="buttons">
        <button
          onClick={toggleMode}
          onMouseEnter={() => setModeHover(true)}
          onMouseLeave={() => setModeHover(false)}
        >
          {mode === "view" ? <EyeOpenIcon /> : <Pencil2Icon />}
          {modeHover && (
            <div>{mode === "view" ? "View Mode" : "Edit Mode"}</div>
          )}
        </button>
        <button
          onClick={toggleHeader}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
        >
          <Cross2Icon />
          {closeHover && <div>Close Header</div>}
        </button>
      </div>
    </header>
  );
};
