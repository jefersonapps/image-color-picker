import { ReactNode } from "react";

interface AlertProps {
  isActive: boolean;
  description: string | ReactNode;
}
export function Alert({ isActive, description }: AlertProps) {
  return (
    <div
      data-active={isActive}
      className="fixed bottom-10 left-1/2 transform -translate-x-1/2 translate-y-[calc(100%_+_40px)] data-[active=true]:-translate-y-5 bg-emerald-600 text-black px-4 py-2 rounded z-50 transition-transform"
    >
      {description}
    </div>
  );
}
