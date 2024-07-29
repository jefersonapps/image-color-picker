"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Color } from "../components/color-info";

interface GlobalContextProps {
  image: string;
  setImage: (img: string) => void;
  hoverColor: Color;
  setHoverColor: (color: Color) => void;
  pickedColor: Color;
  setPickedColor: (color: Color) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [image, setImage] = useState<string>("");
  const [hoverColor, setHoverColor] = useState<Color>({ rgb: "", hex: "" });
  const [pickedColor, setPickedColor] = useState<Color>({ rgb: "", hex: "" });

  return (
    <GlobalContext.Provider
      value={{
        image,
        setImage,
        hoverColor,
        setHoverColor,
        pickedColor,
        setPickedColor,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within an GlobalContextProvider"
    );
  }
  return context;
};
