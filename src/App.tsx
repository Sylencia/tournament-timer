import { useState } from "react";
import "./App.scss";
import { Timer } from "./components/Timer";
import { Header } from "./components/Header";

function App() {
  const [readOnly, setReadOnly] = useState<boolean>(false);

  return (
    <div className="app-container">
      <Header readOnly={readOnly} setReadOnly={setReadOnly} />
      <div className="main-area">
        <Timer id={1} readOnly={readOnly} />
      </div>
    </div>
  );
}

export default App;
