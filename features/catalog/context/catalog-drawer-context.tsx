import { createContext, useState } from "react";

interface DrawerContextType {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const DrawerContext = createContext<DrawerContextType>({
  open: false,
  setOpen: () => {},
});

export const DrawerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>
  );
};
