export function CopiedColor({ color }: { color?: string }) {
  return (
    <span className="flex flex-wrap text-center items-center gap-2 font-medium">
      Cor{" "}
      <div
        className="size-6 rounded-md border shrink-0 border-black"
        style={{ background: color }}
      />{" "}
      <span className="font-bold border border-black px-1 rounded-md">
        {color}
      </span>{" "}
      copiada com sucesso!
    </span>
  );
}
