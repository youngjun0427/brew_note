import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrewSessionStore } from "../../store/useBrewSessionStore";

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function BrewSessionPage() {
  const navigate = useNavigate();
  const { selectedRecipe, setTotalElapsed } = useBrewSessionStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!selectedRecipe) {
    navigate("/", { replace: true });
    return null;
  }

  const steps = selectedRecipe.steps;
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex >= steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setTotalElapsed(elapsedRef.current);
      navigate("/brew/complete", { replace: true });
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-900 px-5 pt-14">
      {/* Elapsed timer */}
      <div className="mb-6 text-center">
        <p className="text-6xl font-bold tabular-nums text-white">{formatTime(elapsed)}</p>
        <p className="mt-1 text-sm text-zinc-500">{selectedRecipe.title}</p>
      </div>

      {/* Step progress */}
      <div className="mb-8 flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-amber-400" : "bg-zinc-700"}`}
          />
        ))}
      </div>

      {currentStep && (
        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-2 text-center text-sm text-zinc-500">
            Step {currentStep.order} / {steps.length}
          </p>

          <div className="text-center">
            <span className="text-8xl font-bold text-white">{currentStep.waterAmount}</span>
            <span className="text-4xl text-zinc-400">ml</span>
          </div>

          {currentStep.pourMethod ? (
            <div className="mt-6 rounded-2xl bg-zinc-800 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">푸어링</p>
              <p className="text-base text-white">{currentStep.pourMethod}</p>
            </div>
          ) : null}

          {currentStep.tip ? (
            <div className="mt-3 rounded-2xl bg-zinc-800/60 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">팁</p>
              <p className="text-sm text-zinc-300">{currentStep.tip}</p>
            </div>
          ) : null}

          {(currentStep.duration > 0 || currentStep.waitTime > 0) && (
            <div className="mt-3 flex gap-3">
              {currentStep.duration > 0 ? (
                <div className="flex-1 rounded-xl bg-zinc-800 p-3">
                  <p className="text-xs text-zinc-500">붓는 시간</p>
                  <p className="text-base font-semibold text-white">{currentStep.duration}초</p>
                </div>
              ) : null}
              {currentStep.waitTime > 0 ? (
                <div className="flex-1 rounded-xl bg-zinc-800 p-3">
                  <p className="text-xs text-zinc-500">대기</p>
                  <p className="text-base font-semibold text-white">{currentStep.waitTime}초</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      <div className="pb-8 pt-4">
        <button
          className="w-full rounded-2xl bg-amber-400 py-4 text-lg font-bold text-zinc-900"
          onClick={handleNext}
        >
          {isLastStep ? "추출 완료" : "다음 단계 →"}
        </button>
      </div>
    </div>
  );
}
