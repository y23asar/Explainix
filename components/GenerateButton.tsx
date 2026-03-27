type GenerateButtonProps = {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
};

export function GenerateButton({ onClick, loading, disabled = false }: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-base"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Generating...
        </>
      ) : (
        "Generate"
      )}
    </button>
  );
}
