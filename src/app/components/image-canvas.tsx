import { RefObject } from "react";
import { ZOOM_CIRCLE_SIZE } from "../constants/canvas";

interface ImageCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  zoomCanvasRef: RefObject<HTMLCanvasElement>;
  image: string;
  handleCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  isHovering: boolean;
}

export default function ImageCanvas({
  canvasRef,
  zoomCanvasRef,
  image,
  handleCanvasClick,
  handleMouseMove,
  handleMouseEnter,
  handleMouseLeave,
  isHovering,
}: ImageCanvasProps) {
  return (
    <div className="flex justify-center relative">
      {image && (
        <>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "crosshair", border: "1px solid black" }}
          />
          {isHovering && (
            <canvas
              ref={zoomCanvasRef}
              width={ZOOM_CIRCLE_SIZE}
              height={ZOOM_CIRCLE_SIZE}
              style={{
                position: "absolute",
                borderRadius: "50%",
                border: "1px solid black",
                pointerEvents: "none",
                width: ZOOM_CIRCLE_SIZE,
                height: ZOOM_CIRCLE_SIZE,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
