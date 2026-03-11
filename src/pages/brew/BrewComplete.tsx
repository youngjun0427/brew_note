import { useNavigate } from "react-router-dom";
import { useBrewSessionStore } from "../../store/useBrewSessionStore";

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function BrewCompletePage() {
  const navigate = useNavigate();
  const { selectedRecipe, selectedBean, totalElapsed, reset } = useBrewSessionStore();

  const handleSkip = () => {
    reset();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 px-5">
      <p className="mb-3 text-7xl">☕</p>
      <h1 className="mb-1 text-3xl font-bold text-white">추출 완료!</h1>
      <p className="mb-6 text-lg text-zinc-400">총 {formatTime(totalElapsed)}</p>

      {selectedRecipe && (
        <div className="mb-8 w-full rounded-2xl bg-zinc-800 p-4">
          <div className="flex justify-between py-1">
            <span className="text-sm text-zinc-400">레시피</span>
            <span className="text-sm text-white">{selectedRecipe.title}</span>
          </div>
          {selectedBean && (
            <div className="flex justify-between py-1">
              <span className="text-sm text-zinc-400">원두</span>
              <span className="text-sm text-white">{selectedBean.name}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-sm text-zinc-400">추출 시간</span>
            <span className="text-sm text-white">{formatTime(totalElapsed)}</span>
          </div>
        </div>
      )}

      <div className="w-full space-y-3">
        <button
          className="w-full rounded-2xl bg-amber-400 py-4 text-lg font-bold text-zinc-900"
          onClick={() => navigate("/brew/evaluate")}
        >
          평가하기
        </button>
        <button
          className="w-full rounded-2xl border border-zinc-700 py-4 text-base text-zinc-400"
          onClick={handleSkip}
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
