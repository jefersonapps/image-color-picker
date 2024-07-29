import { X } from "lucide-react";
import { useImageUpload } from "../hooks/useImageUpload";
import { Alert } from "./alert";

import Lottie from "react-lottie";
import animationDataImg from "../lotties/upload-img.json";
import { useScreen } from "../hooks/useScreen";
import { useEffect } from "react";

const defaultOptionsImg = {
  loop: true,
  autoplay: true,
  animationData: animationDataImg,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export function DropOverlay() {
  const { isDragging, setIsDragging, isDropped, overlayRef } = useImageUpload();
  const { isMobile } = useScreen();

  const IMAGE_ICON_SIZE = isMobile ? 150 : 250;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("keydown", handleKeyDown);
      overlayRef.current?.focus();
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDragging]);

  return (
    <>
      {isDragging && (
        <div
          ref={overlayRef}
          tabIndex={-1}
          onClick={() => setIsDragging(false)}
          className="fixed inset-0 flex p-0 items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-40"
        >
          <button
            onClick={() => setIsDragging(false)}
            className="absolute top-2 right-4 z-50"
          >
            <X />
          </button>
          <div className="pointer-events-none flex flex-col">
            <Lottie
              options={defaultOptionsImg}
              height={IMAGE_ICON_SIZE}
              width={IMAGE_ICON_SIZE}
            />
            <span className="text-white text-2xl font-semibold">
              Solte a imagem <span className="text-emerald-500">aqui</span>
            </span>
          </div>
        </div>
      )}

      <Alert isActive={isDropped} description="Imagem carregada com sucesso!" />
    </>
  );
}
