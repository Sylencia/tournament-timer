import { useContext } from "react";
import clsx from "clsx";
import { PrefsContext } from "./PrefsContext";
import { Header } from "./components/Header";
import { Event } from "./components/Event";
import "./App.scss";
import { useUpdateTick } from "./hooks/useUpdateTick";

function App() {
  const { colorScheme, showHeader } = useContext(PrefsContext);
  useUpdateTick(300);

  return (
    <div
      className={clsx("app-container", {
        light: colorScheme === "light",
        dark: colorScheme === "dark",
        "top-pad": !showHeader,
      })}
    >
      {showHeader && <Header />}
      <Event id={1} />
      <Event id={2} />
      <Event id={3} />
      <Event id={4} />
    </div>
  );
}

export default App;
