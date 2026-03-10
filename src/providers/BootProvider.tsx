"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface BootContextType {
  isBootComplete: boolean;
  setBootComplete: () => void;
  shouldSkipBoot: boolean;
}

const BootContext = createContext<BootContextType>({
  isBootComplete: false,
  setBootComplete: () => {},
  shouldSkipBoot: false,
});

export function BootProvider({ children }: { children: ReactNode }) {
  const [isBootComplete, setIsBootComplete] = useState(false);

  const shouldSkipBoot =
    typeof window !== "undefined" &&
    sessionStorage.getItem("boot-complete") === "true";

  const setBootComplete = useCallback(() => {
    setIsBootComplete(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("boot-complete", "true");
    }
  }, []);

  return (
    <BootContext.Provider
      value={{
        isBootComplete: isBootComplete || shouldSkipBoot,
        setBootComplete,
        shouldSkipBoot,
      }}
    >
      {children}
    </BootContext.Provider>
  );
}

export function useBoot() {
  return useContext(BootContext);
}
