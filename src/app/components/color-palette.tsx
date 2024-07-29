import { Copy } from "lucide-react";
import { Suspense, useState } from "react";
import { PaletteColors } from "react-palette";
import { useSearchParams } from "next/navigation";
import { ColorFormat } from "./color-info";
import { hexToRgb } from "../utils/conversion";
import { Alert } from "./alert";
import { CopiedColor } from "./copied-color";
import { Loading } from "./loading";

export function ColorPalette({ data }: { data: PaletteColors }) {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [colorKey, setColorKey] = useState("");

  async function copyColorToClipboard(key: string, color?: string) {
    try {
      if (color) {
        const newColorFormat = searchParams.get("color-format");
        let colorFormat: ColorFormat = "hex";
        if (newColorFormat) {
          colorFormat = newColorFormat as ColorFormat;
        } else {
          colorFormat = "hex";
        }

        if (colorFormat === "hex") {
          await navigator.clipboard.writeText(color);
        }

        if (colorFormat === "rgb") {
          const rgbColor = hexToRgb(color);

          if (rgbColor) {
            const { r, g, b } = rgbColor;
            const rgbColorString = `rgb(${r}, ${g}, ${b})`;
            await navigator.clipboard.writeText(rgbColorString);
          }
        }

        setCopied(true);
        setColorKey(key);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }

  if (!data) return null;

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col items-center gap-1 md:items-start">
        <h2 className="font-semibold">Paleta de cores</h2>
        <Alert
          isActive={copied}
          description={<CopiedColor color={data[colorKey]} />}
        />
        <div className="flex w-fit rounded-lg overflow-hidden">
          {Object.entries(data).map(([key, color]) => (
            <div key={key} className="relative">
              <div
                style={{
                  backgroundColor: color,
                }}
                className="size-12"
              />
              <button
                title="Copiar"
                onClick={() => copyColorToClipboard(key, color)}
                className="absolute group inset-0 flex justify-center items-center bg-transparent hover:bg-black/50 transition-colors"
              >
                <Copy
                  data-copied={copied && key === colorKey}
                  className="invisible text-white group-hover:visible data-[copied=true]:visible data-[copied=true]:text-emerald-600 transition-colors"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
