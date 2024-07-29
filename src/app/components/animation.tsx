import Lottie from "react-lottie";
import animationDataImg from "../lotties/upload-img.json";
import { useScreen } from "../hooks/useScreen";

const defaultOptionsImg = {
  loop: true,
  autoplay: true,
  animationData: animationDataImg,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
export function Animation() {
  const { isMobile } = useScreen();

  const IMAGE_ICON_SIZE = isMobile ? 150 : 250;

  return (
    <div className="w-fit mx-auto">
      <div className="border-2 border-dashed border-zinc-500 p-4 rounded-lg overflow-hidden transition-all">
        <p className="text-lg font-semibold text-zinc-200">
          Ou cole uma imagem da área de transferência
        </p>

        <div className="pointer-events-none">
          <Lottie
            options={defaultOptionsImg}
            height={IMAGE_ICON_SIZE}
            width={IMAGE_ICON_SIZE}
          />
        </div>
      </div>
    </div>
  );
}
