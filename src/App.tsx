import { useState } from "react";
import "./App.scss";
import { Timer } from "./components/Timer";
import { Header } from "./components/Header";
import { AddEvent } from "./components/AddEvent";

function App() {
  const [readOnly, setReadOnly] = useState<boolean>(false);

  return (
    <div className="app-container">
      <Header readOnly={readOnly} setReadOnly={setReadOnly} />
      <div className="main-area">
        <Timer id={1} readOnly={readOnly} />
        <Timer id={2} readOnly={readOnly} />
        <AddEvent />
        <AddEvent />
      </div>
    </div>
  );
}

export default App;
