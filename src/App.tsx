import { useContext } from "react";
import clsx from "clsx";
import { ModeContext } from "./ModeContext";
import { Header } from "./components/Header";
import { Event } from "./components/Event";
import "./App.scss";

function App() {
  const { colorScheme } = useContext(ModeContext);

  return (
    <div
      className={clsx("app-container", {
        light: colorScheme === "light",
        dark: colorScheme === "dark",
      })}
    >
      <Header />
      <Event id={1} />
      <Event id={2} />
      <Event id={3} />
      <Event id={4} />
    </div>
  );
}

export default App;
