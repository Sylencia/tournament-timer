import { ReactNode, createContext, useState } from "react";

interface IPrefsContext {
  mode: "view" | "edit";
  colorScheme: "light" | "dark";
  showHeader: boolean;
  toggleMode: () => void;
  toggleColorScheme: () => void;
  toggleHeader: () => void;
}

interface IPrefsProviderProps {
  children: ReactNode;
}

const defaultState: IPrefsContext = {
  mode: "edit",
  colorScheme: "dark",
  showHeader: true,
  toggleMode: () => {},
  toggleColorScheme: () => {},
  toggleHeader: () => {},
};

export const PrefsContext = createContext<IPrefsContext>(defaultState);

export const PrefsProvider = ({ children }: IPrefsProviderProps) => {
  const [mode, setMode] = useState<IPrefsContext["mode"]>(defaultState.mode);
  const [colorScheme, setColorScheme] = useState<IPrefsContext["colorScheme"]>(
    defaultState.colorScheme
  );
  const [showHeader, setShowHeader] = useState<IPrefsContext["showHeader"]>(
    defaultState.showHeader
  );

  const toggleMode = () => {
    setMode((prev: IPrefsContext["mode"]) =>
      prev === "edit" ? "view" : "edit"
    );
  };

  const toggleColorScheme = () => {
    setColorScheme((prev: IPrefsContext["colorScheme"]) =>
      prev === "dark" ? "light" : "dark"
    );
  };

  const toggleHeader = () => {
    setShowHeader((prev: IPrefsContext["showHeader"]) => !prev);
  };

  return (
    <PrefsContext.Provider
      value={{
        mode,
        colorScheme,
        showHeader,
        toggleMode,
        toggleColorScheme,
        toggleHeader,
      }}
    >
      {children}
    </PrefsContext.Provider>
  );
};
