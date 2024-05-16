import { useContext } from "react";
import "./Header.scss";
import { ModeContext } from "../../ModeContext";
import {
  EyeOpenIcon,
  MoonIcon,
  Pencil2Icon,
  SunIcon,
} from "@radix-ui/react-icons";

export const Header = () => {
  const { mode, toggleMode, colorScheme, toggleColorScheme } =
    useContext(ModeContext);

  return (
    <header className="header">
      <h3>Tournament Timer</h3>
      <div>
        <button onClick={toggleColorScheme}>
          {colorScheme === "light" ? <SunIcon /> : <MoonIcon />}
        </button>
        <button onClick={toggleMode}>
          {mode === "view" ? <EyeOpenIcon /> : <Pencil2Icon />}
        </button>
      </div>
    </header>
  );
};
