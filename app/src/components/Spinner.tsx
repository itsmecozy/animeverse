export const Spinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-10 h-10 rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent)] animate-spin" />
    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-3">
    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Something went wrong</p>
    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{message}</p>
    {onRetry && <button onClick={onRetry} className="btn-secondary mt-2">Try again</button>}
  </div>
);
