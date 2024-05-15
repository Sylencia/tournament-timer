import { ReactNode, createContext, useState } from "react";

interface IModeContext {
  mode: "view" | "edit";
  toggleMode: () => void;
}

interface IModeProviderProps {
  children: ReactNode;
}

const defaultState: IModeContext = {
  mode: "edit",
  toggleMode: () => {},
};

export const ModeContext = createContext<IModeContext>(defaultState);

export const ModeProvider = ({ children }: IModeProviderProps) => {
  const [mode, setMode] = useState<IModeContext["mode"]>(defaultState.mode);

  const toggleMode = () => {
    setMode((prev: IModeContext["mode"]) =>
      prev === "edit" ? "view" : "edit"
    );
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        toggleMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
