import { useState } from "react";
import "./App.scss";
import { Timer } from "./components/Timer";
import { Header } from "./components/Header";
import { AddEvent } from "./components/AddEvent";
import { ModeProvider } from "./ModeContext";

function App() {
  const [readOnly, setReadOnly] = useState<boolean>(false);

  return (
    <ModeProvider>
      <div className="app-container">
        <Header />
        <div className="main-area">
          <Timer id={1} />
          <Timer id={2} />
          <AddEvent />
          <AddEvent />
        </div>
      </div>
    </ModeProvider>
  );
}

export default App;
