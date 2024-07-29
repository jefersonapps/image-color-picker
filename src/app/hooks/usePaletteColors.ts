import { useEffect } from "react";
import { usePalette } from "react-palette";
import { hexToRgb } from "../utils/conversion";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useGlobalContext } from "../contexts/global-context";

export const usePaletteColors = (image: string) => {
  const { data, loading, error } = usePalette(image);
  const { hoverColor, setHoverColor, pickedColor, setPickedColor } =
    useGlobalContext();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const hexColor = data.vibrant;
    if (hexColor) {
      const rgb = hexToRgb(hexColor);
      if (rgb) {
        const { r, g, b } = rgb;
        const rgbColor = `rgb(${r}, ${g}, ${b})`;

        if (
          !hoverColor.hex &&
          !hoverColor.rgb &&
          !pickedColor.hex &&
          !pickedColor.rgb
        ) {
          setHoverColor({ hex: hexColor, rgb: rgbColor });
          setPickedColor({ hex: hexColor, rgb: rgbColor });
        }

        const params = new URLSearchParams(searchParams.toString());
        const hasColorFormat = params.has("color-format");

        if (!hasColorFormat) {
          params.set("color-format", "hex");

          const paramsString = params.toString();

          const updatedPath = paramsString
            ? `${pathname}?${paramsString}`
            : pathname;

          router.push(updatedPath);
        }
      }
    }
  }, [data, searchParams, pathname, router]);

  return { data, loading, error };
};
