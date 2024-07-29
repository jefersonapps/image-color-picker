import { useState } from "react";
import { rgbToHex } from "../utils/conversion";
import { ZOOM_CIRCLE_SIZE, ZOOM_FACTOR } from "../constants/canvas";
import { useGlobalContext } from "../contexts/global-context";

interface UseMouseEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoomCanvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const useMouseEvents = ({
  canvasRef,
  zoomCanvasRef,
  containerRef,
}: UseMouseEventsProps) => {
  const { hoverColor, setHoverColor } = useGlobalContext();
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const zoomCanvas = zoomCanvasRef.current;
    const container = containerRef?.current;
    if (!canvas || !zoomCanvas) return;

    const ctx = canvas.getContext("2d");
    const zoomCtx = zoomCanvas.getContext("2d");
    if (!ctx || !zoomCtx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const zoomWidth = ZOOM_CIRCLE_SIZE / ZOOM_FACTOR;
    const zoomHeight = ZOOM_CIRCLE_SIZE / ZOOM_FACTOR;

    zoomCtx.clearRect(0, 0, ZOOM_CIRCLE_SIZE, ZOOM_CIRCLE_SIZE);

    zoomCtx.drawImage(
      canvas,
      x - zoomWidth / 2,
      y - zoomHeight / 2,
      zoomWidth,
      zoomHeight,
      0,
      0,
      ZOOM_CIRCLE_SIZE,
      ZOOM_CIRCLE_SIZE
    );

    zoomCtx.strokeStyle = "red";
    zoomCtx.lineWidth = 2;
    zoomCtx.strokeRect(
      ZOOM_CIRCLE_SIZE / 2 - 5,
      ZOOM_CIRCLE_SIZE / 2 - 5,
      10,
      10
    );

    const scrollTop = container?.scrollTop || 0;
    const scrollLeft = container?.scrollLeft || 0;

    const overflowX = event.clientX > window.innerWidth - 280;
    const overflowY = event.clientY > rect.bottom - 280;

    const gap = 50;

    const horizontalPadding = overflowX ? -gap - ZOOM_CIRCLE_SIZE : gap;
    const verticalPadding = overflowY ? -gap - ZOOM_CIRCLE_SIZE : gap;

    zoomCanvas.style.left = `${
      event.clientX + horizontalPadding + scrollLeft
    }px`;
    zoomCanvas.style.top = `${
      event.clientY + verticalPadding + scrollTop - rect.top
    }px`;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    const hexColor = rgbToHex(r, g, b);
    setHoverColor({ rgb: rgbColor, hex: hexColor });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return {
    hoverColor,
    isHovering,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
};
