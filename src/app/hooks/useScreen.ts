import { useEffect, useState } from "react";
import {
  DEFAULT_MAX_CANVAS_HEIGHT,
  DEFAULT_MAX_CANVAS_WIDTH,
} from "../constants/canvas";

export const useScreen = () => {
  const [screenWidth, setScreenWidth] = useState<number>(
    DEFAULT_MAX_CANVAS_WIDTH
  );

  const [screenHeight, setScreenHeight] = useState(DEFAULT_MAX_CANVAS_HEIGHT);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleWindowSizeChange = () => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      };

      window.addEventListener("resize", handleWindowSizeChange);
      handleWindowSizeChange();

      return () => {
        window.removeEventListener("resize", handleWindowSizeChange);
      };
    }
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;

  return { isMobile, isTablet, isDesktop, screenWidth, screenHeight };
};
