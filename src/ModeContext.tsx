import { ReactNode, createContext, useState } from "react";

interface IModeContext {
  mode: "view" | "edit";
  colorScheme: "light" | "dark";
  toggleMode: () => void;
  toggleColorScheme: () => void;
}

interface IModeProviderProps {
  children: ReactNode;
}

const defaultState: IModeContext = {
  mode: "edit",
  colorScheme: "dark",
  toggleMode: () => {},
  toggleColorScheme: () => {},
};

export const ModeContext = createContext<IModeContext>(defaultState);

export const ModeProvider = ({ children }: IModeProviderProps) => {
  const [mode, setMode] = useState<IModeContext["mode"]>(defaultState.mode);
  const [colorScheme, setColorScheme] = useState<IModeContext["colorScheme"]>(
    defaultState.colorScheme
  );

  const toggleMode = () => {
    setMode((prev: IModeContext["mode"]) =>
      prev === "edit" ? "view" : "edit"
    );
  };

  const toggleColorScheme = () => {
    setColorScheme((prev: IModeContext["colorScheme"]) =>
      prev === "dark" ? "light" : "dark"
    );
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        colorScheme,
        toggleMode,
        toggleColorScheme,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
