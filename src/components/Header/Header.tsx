import { useContext, useState } from "react";
import "./Header.scss";
import { PrefsContext } from "../../PrefsContext";
import { Cross2Icon, EyeOpenIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { ExpandableButton } from "../ExpandableButton";

export const Header = () => {
  const { mode, toggleMode, toggleHeader } = useContext(PrefsContext);
  const [modeHover, setModeHover] = useState<IButtonFocus>({
    hover: false,
    focus: false,
  });
  const [closeHover, setCloseHover] = useState<IButtonFocus>({
    hover: false,
    focus: false,
  });

  return (
    <header className="header-container">
      <h3>Tournament Timer</h3>
      <div className="buttons">
        <ExpandableButton
          onClick={toggleMode}
          icon={mode === "view" ? <EyeOpenIcon /> : <Pencil2Icon />}
          expandedText={mode === "view" ? "View Mode" : "Edit Mode"}
        />
        <ExpandableButton
          onClick={toggleHeader}
          icon={<Cross2Icon />}
          expandedText={"Close Header"}
        />
      </div>
    </header>
  );
};
