import { ComponentProps } from "react";

export function FileInput(props: ComponentProps<"input">) {
  return (
    <div className="flex items-center justify-center w-fit mx-auto">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-fit px-4 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-800 hover:bg-zinc-900 border-zinc-600 hover:border-zinc-500"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-zinc-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-base text-zinc-300 text-center">
            <span className="font-semibold">
              Clique para escolher uma imagem
            </span>{" "}
            ou arraste e solte
          </p>
          <p className="text-sm text-center text-zinc-300">
            SVG, PNG, JPG ou GIF
          </p>
        </div>
        <input {...props} id="dropzone-file" type="file" className="hidden" />
      </label>
    </div>
  );
}
