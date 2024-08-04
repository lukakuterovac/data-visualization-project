import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isOn, setIsOn] = useState(true);

  const toggle = () => setIsOn((prevIsOn) => !prevIsOn);

  return (
    <AppContext.Provider value={{ isOn, toggle }}>
      {children}
    </AppContext.Provider>
  );
};
