type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorView({ message = "오류가 발생했어요", onRetry }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 px-6">
      <p className="mb-2 text-base font-semibold text-white">오류가 발생했어요</p>
      {message ? <p className="mb-6 text-center text-sm text-zinc-400">{message}</p> : null}
      {onRetry && (
        <button className="rounded-xl bg-amber-400 px-6 py-3" onClick={onRetry}>
          <span className="font-semibold text-zinc-900">다시 시도</span>
        </button>
      )}
    </div>
  );
}
