import { ModeProvider } from "./ModeContext";
import { Timer } from "./components/Timer";
import { Header } from "./components/Header";
import { AddEvent } from "./components/AddEvent";
import { EventSetup } from "./components/EventSetup";
import "./App.scss";

function App() {
  return (
    <ModeProvider>
      <div className="app-container">
        <Header />
        <Timer id={1} />
        <Timer id={2} />
        <AddEvent />
        <EventSetup />
      </div>
    </ModeProvider>
  );
}

export default App;
