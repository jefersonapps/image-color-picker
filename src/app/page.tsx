"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  DEFAULT_MAX_CANVAS_HEIGHT,
  DEFAULT_MAX_CANVAS_WIDTH,
} from "./constants/canvas";
import { ColorPalette } from "./components/color-palette";
import { ColorInfo } from "./components/color-info";
import ImageCanvas from "./components/image-canvas";
import { Expand, Github } from "lucide-react";
import { FileInput } from "./components/file-input";
import Image from "next/image";
import { Animation } from "./components/animation";
import { useCallback } from "react";
import { useImageCanvas } from "./hooks/useImageCanvas";
import { useGlobalContext } from "./contexts/global-context";
import { useImageUpload } from "./hooks/useImageUpload";
import { useMouseEvents } from "./hooks/useMouseEvents";
import { usePaletteColors } from "./hooks/usePaletteColors";
import { DropOverlay } from "./components/drop-overlay";
import { useScreen } from "./hooks/useScreen";

export default function Home() {
  const { image, pickedColor } = useGlobalContext();

  const { isMobile, screenWidth, screenHeight } = useScreen();

  const { canvasRef, handleCanvasClick, zoomCanvasRef } = useImageCanvas({
    image,
    maxCanvasHeight: isMobile ? screenHeight : DEFAULT_MAX_CANVAS_HEIGHT,
    maxCanvasWidth: isMobile ? screenWidth : DEFAULT_MAX_CANVAS_WIDTH,
  });

  const { handleImageUpload } = useImageUpload();

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
  const params = useSearchParams();

  const handleDetailsClick = useCallback(() => {
    if (image) {
      const paramsString = params.toString();
      console.log(paramsString);

      if (paramsString) {
        const updatedPath = `/details?${paramsString}`;
        router.push(updatedPath);
      }
    }
  }, [params, image]);

  return (
    <main className="space-y-2 md:space-y-4 p-2 md:p-4 overflow-hidden">
      <DropOverlay />
      <header className="max-w-5xl mx-auto flex gap-2 items-center pb-2 border-b-[1px] border-zinc-400">
        <Image
          src="/icon.png"
          alt="Ícone do app - a imagem mostra um conta-gotas acima de uma paleta de cores"
          width="0"
          height="0"
          sizes="32px"
          className="w-8 h-auto"
        />{" "}
        <h1 className="font-extrabold text-xl">Image Color Picker</h1>
        <a
          className="ml-auto cursor-pointer"
          href="https://github.com/jefersonapps"
          rel="noreferrer"
          target="_blank"
          title="GitHub"
        >
          <Github />
        </a>
      </header>

      <FileInput onChange={handleImageUpload} />

      {image && (
        <button
          onClick={handleDetailsClick}
          className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold uppercase flex px-4 py-2 gap-2 rounded-lg mx-auto transition-colors"
        >
          <Expand /> Ver Detalhes
        </button>
      )}

      <div>
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

        {!image && <Animation />}
      </div>
      <div className="block space-y-2 gap-2 md:gap-4 justify-center md:flex">
        {data && !loading && !error && <ColorPalette data={data} />}

        {image && (
          <ColorInfo hoverColor={hoverColor} pickedColor={pickedColor} />
        )}
      </div>
    </main>
  );
}
