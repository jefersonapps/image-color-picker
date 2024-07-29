import { Copy } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Alert } from "./alert";
import { CopiedColor } from "./copied-color";

export interface Color {
  rgb: string;
  hex: string;
}

interface ColorHueProps {
  label: string;
  color: string;
}

function ColorHue({ label, color }: ColorHueProps) {
  const [copied, setCopied] = useState(false);

  async function copyContent() {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <Alert isActive={copied} description={<CopiedColor color={color} />} />
      <div
        style={{ backgroundColor: color }}
        className="size-10 rounded-md transition-colors flex-shrink-0"
      ></div>
      <div className="flex-1 text-ellipsis overflow-hidden">
        <span className="font-bold whitespace-nowrap">{label}</span>
      </div>

      <div className="flex flex-1 justify-between gap-2">
        <div className="w-40 text-center border border-zinc-200 rounded-md">
          {color}
        </div>

        <button
          onClick={copyContent}
          data-copied={copied}
          className="text-white data-[copied=true]:text-emerald-600"
          title="Copiar"
        >
          <Copy />
        </button>
      </div>
    </div>
  );
}

interface ColorInfoProps {
  hoverColor?: Color;
  pickedColor?: Color;
}

export type ColorFormat = "rgb" | "hex";

export function ColorInfo({ hoverColor, pickedColor }: ColorInfoProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const newColorFormat = searchParams.get("color-format");

  const [colorFormat, setColorFormat] = useState<ColorFormat>(() => {
    if (newColorFormat) {
      return newColorFormat as ColorFormat;
    } else {
      return "hex";
    }
  });

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const newColorFormat = event.target.value as ColorFormat;
    const params = new URLSearchParams(searchParams.toString());
    params.set("color-format", newColorFormat);

    const paramsString = params.toString();

    const updatedPath = paramsString ? `${pathname}?${paramsString}` : pathname;

    router.push(updatedPath);

    setColorFormat(newColorFormat);
  }

  return (
    <div className="bg-zinc-800 flex flex-col gap-2 p-2 rounded-md">
      <div className="flex justify-center items-center gap-2">
        <label htmlFor="colorFormat" className="font-semibold">
          Formato da cor:
        </label>
        <select
          id="colorFormat"
          value={colorFormat || "hex"}
          onChange={handleChange}
          className="bg-zinc-900 text-white rounded-md p-1"
        >
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
        </select>
      </div>
      {hoverColor && (
        <ColorHue label="Cor atual:" color={hoverColor[colorFormat]} />
      )}
      {pickedColor && (
        <ColorHue label="Cor selecionada:" color={pickedColor[colorFormat]} />
      )}
    </div>
  );
}
