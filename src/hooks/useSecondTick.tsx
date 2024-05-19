import { useEffect } from "react";

export const useSecondTick = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const event = new Event("timerTick");
      window.dispatchEvent(event);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};
