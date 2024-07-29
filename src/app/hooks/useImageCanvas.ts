import { useEffect, useRef } from "react";
import { rgbToHex } from "../utils/conversion";
import { useScreen } from "./useScreen";
import { useGlobalContext } from "../contexts/global-context";

interface UseImageCanvasProps {
  image: string;
  maxCanvasWidth: number | "full";
  maxCanvasHeight: number | "full";
}

export const useImageCanvas = ({
  image,
  maxCanvasWidth,
  maxCanvasHeight,
}: UseImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { screenWidth, screenHeight, isMobile } = useScreen();
  const { setPickedColor } = useGlobalContext();

  const calculateDimensions = (img: HTMLImageElement, padding: number) => {
    let { width, height } = img;

    const calculateScaleFactor = (targetSize: number, originalSize: number) =>
      targetSize / originalSize;

    const adjustDimensions = (scaleFactor: number) => {
      width = width * scaleFactor - padding;
      height = height * scaleFactor - padding;
    };

    if (width > height && typeof maxCanvasWidth === "number") {
      const scaleFactor = calculateScaleFactor(maxCanvasWidth, width);
      adjustDimensions(scaleFactor);
    }

    if (width <= height && typeof maxCanvasHeight === "number") {
      const scaleFactor = calculateScaleFactor(maxCanvasHeight, height);
      adjustDimensions(scaleFactor);
      if (width > screenWidth - padding) {
        width = screenWidth - padding;
      }
    }

    if (width > height && maxCanvasWidth === "full") {
      const targetWidth = isMobile ? Math.max(screenWidth, width) : screenWidth;
      const scaleFactor = calculateScaleFactor(targetWidth, width);
      adjustDimensions(scaleFactor);
    }

    if (width <= height && maxCanvasHeight === "full") {
      const scaleFactor = calculateScaleFactor(screenHeight, height);
      width = width * scaleFactor - padding;
      height = screenHeight - padding;
      if (width > screenWidth - padding) {
        width = screenWidth - padding;
      }
    }

    return { width, height };
  };

  const drawImageOnCanvas = (
    img: HTMLImageElement,
    width: number,
    height: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
    }
  };

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const padding = isMobile ? 20 : 40;
        const { width, height } = calculateDimensions(img, padding);
        drawImageOnCanvas(img, width, height);
      };
    }
  }, [image, screenWidth, screenHeight, maxCanvasHeight, maxCanvasWidth]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    const hexColor = rgbToHex(r, g, b);

    setPickedColor({ rgb: rgbColor, hex: hexColor });
  };

  return {
    canvasRef,
    zoomCanvasRef,
    containerRef,
    handleCanvasClick,
  };
};
