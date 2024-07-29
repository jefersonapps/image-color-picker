import { useGlobalContext } from "../contexts/global-context";
import { useEffect, useRef, useState } from "react";

export const useImageUpload = () => {
  const { setImage } = useGlobalContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target) {
        setImage(e.target.result as string);
        setIsDropped(true);
        setTimeout(() => setIsDropped(false), 2000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      const itemsArray = Array.from(items);
      itemsArray.forEach((item) => {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target) {
                setImage(e.target.result as string);
                setIsDropped(true);
                setTimeout(() => setIsDropped(false), 2000);
              }
            };
            reader.readAsDataURL(file);
          }
        }
      });
    }
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImage(e.target.result as string);
          setIsDropped(true);
          setTimeout(() => setIsDropped(false), 2000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragend", handleDragEnd);
    overlayRef.current?.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragend", handleDragEnd);
      overlayRef.current?.removeEventListener("drop", handleDrop);
    };
  }, [isDragging]);

  return {
    handleImageUpload,
    isDragging,
    setIsDragging,
    isDropped,
    overlayRef,
  };
};
