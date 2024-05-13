import { useEffect, useLayoutEffect, useRef } from "react";

export const useInterval = (callback: () => void, delay: number | null) => {
  const callbackRef = useRef<() => void>(callback);

  // update callback function with current render callback that has access to latest props and state
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) {
      return () => {};
    }

    const interval = setInterval(() => {
      callbackRef.current && callbackRef.current();
    }, delay);

    return () => clearInterval(interval);
  }, [delay]);
};
