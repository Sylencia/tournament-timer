import { useContext, useEffect, useState } from "react";
import "./Header.scss";
import { PrefsContext } from "../../PrefsContext";
import { Cross2Icon, EyeOpenIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { ExpandableButton } from "../ExpandableButton";

const getCurrentTimeString = (): string => {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const timeString = `${hours}:${minutes}`;
  return timeString;
};

export const Header = () => {
  const { mode, toggleMode, toggleHeader, showHeader } =
    useContext(PrefsContext);

  const [currentTime, setCurrentTime] = useState<string>(
    getCurrentTimeString()
  );

  const updateTime = (): void => {
    setCurrentTime(getCurrentTimeString());
  };

  useEffect(() => {
    window.addEventListener("timerTick", updateTime);

    return () => window.removeEventListener("timerTick", updateTime);
  });

  return (
    <header className="header-container">
      <h3 className="current-time">{currentTime}</h3>
      {showHeader && (
        <div className="buttons">
          <ExpandableButton
            onClick={toggleMode}
            icon={mode === "view" ? <EyeOpenIcon /> : <Pencil2Icon />}
            expandedText={mode === "view" ? "View Mode" : "Edit Mode"}
          />
          <ExpandableButton
            onClick={toggleHeader}
            icon={<Cross2Icon />}
            expandedText={"Hide Buttons"}
          />
        </div>
      )}
    </header>
  );
};
