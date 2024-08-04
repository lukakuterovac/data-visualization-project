import { createContext, useState, useContext } from "react";

const AnimationContext = createContext();

export const useAnimation = () => useContext(AnimationContext);

export const AnimationProvider = ({ children }) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const toggle = () => setAnimationsEnabled((prev) => !prev);

  return (
    <AnimationContext.Provider
      value={{ animationsEnabled, toggle, animationSpeed, setAnimationSpeed }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
