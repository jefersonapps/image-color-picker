"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ColorPalette } from "../components/color-palette";
import ImageCanvas from "../components/image-canvas";
import { ZOOM_CIRCLE_SIZE } from "../constants/canvas";
import { ArrowLeft } from "lucide-react";
import { ColorInfo } from "../components/color-info";
import { useGlobalContext } from "../contexts/global-context";
import { useImageCanvas } from "../hooks/useImageCanvas";
import { useMouseEvents } from "../hooks/useMouseEvents";
import { usePaletteColors } from "../hooks/usePaletteColors";
import { Suspense } from "react";
import { Loading } from "../components/loading";

export default function ImageDetailsPage() {
  const { image, pickedColor } = useGlobalContext();

  const { canvasRef, handleCanvasClick, zoomCanvasRef, containerRef } =
    useImageCanvas({
      image,
      maxCanvasHeight: "full",
      maxCanvasWidth: "full",
    });

  const {
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    hoverColor,
    isHovering,
  } = useMouseEvents({
    canvasRef,
    zoomCanvasRef,
  });

  const { data, error, loading } = usePaletteColors(image);
  const router = useRouter();

  const searchParams = useSearchParams();

  function handleBackClick() {
    const params = searchParams.toString();
    router.push(`/?${params}`);
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-svh overflow-hidden relative pt-14 md:pt-16">
        <button
          className="absolute top-2 left-2 md:top-4 md:left-4 z-50 px-4 py-2 rounded-md bg-zinc-800 flex gap-2 hover:bg-zinc-200 hover:text-black shadow-black/50 shadow-md transition-colors"
          onClick={handleBackClick}
        >
          <ArrowLeft /> <span>Voltar</span>
        </button>

        <div
          className="h-[calc(100%_-_238px)] md:h-[calc(100%_-_174px)] overflow-auto"
          ref={containerRef}
          style={{ paddingBottom: ZOOM_CIRCLE_SIZE + "px" }}
        >
          {image && (
            <ImageCanvas
              canvasRef={canvasRef}
              handleCanvasClick={handleCanvasClick}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              handleMouseMove={handleMouseMove}
              image={image}
              isHovering={isHovering}
              zoomCanvasRef={zoomCanvasRef}
            />
          )}
        </div>

        <div className="absolute z-50 bottom-0 left-0 right-0 p-2 md:p-4">
          {data && !loading && !error && (
            <div className="block justify-center space-y-2 gap-2 md:gap-4 md:flex">
              {data && !loading && !error && <ColorPalette data={data} />}
              <ColorInfo hoverColor={hoverColor} pickedColor={pickedColor} />
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
