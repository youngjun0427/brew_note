import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BrewCountdownPage() {
  const navigate = useNavigate();
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      navigate("/brew/session", { replace: true });
    }
  }, [count, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900">
      <p className="text-9xl font-bold text-white">{count || "Go"}</p>
      <p className="mt-6 text-lg text-zinc-400">준비하세요...</p>
      <p className="mt-2 text-sm text-zinc-600">저울과 케틀을 확인해주세요</p>
    </div>
  );
}
