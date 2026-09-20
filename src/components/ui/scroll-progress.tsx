/** Filet de progression de lecture — piloté uniquement par CSS (scroll timeline). */
export function ScrollProgress() {
  return (
    <div
      aria-hidden
      className="progress-bar fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-terra"
    />
  );
}
