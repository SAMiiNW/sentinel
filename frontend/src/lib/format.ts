export const shortAddr = (a: string): string =>
  a && a.length > 10 ? `${a.slice(0, 6)}\u2026${a.slice(-4)}` : a;

export const shortHash = (h: string): string =>
  h && h.length > 14 ? `${h.slice(0, 10)}\u2026${h.slice(-6)}` : h;

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export const rulingText: Record<string, string> = {
  COMPLIANT: 'text-compliant',
  FLAGGED: 'text-flagged',
  BLOCKED: 'text-blocked',
};

export const rulingLabel: Record<string, string> = {
  COMPLIANT: 'Compliant',
  FLAGGED: 'Flagged',
  BLOCKED: 'Blocked',
};

// Tailwind-friendly accent ring/glow per ruling
export const rulingGlow: Record<string, string> = {
  COMPLIANT: 'shadow-[0_0_36px_-10px_rgba(94,234,212,0.6)]',
  FLAGGED: 'shadow-[0_0_36px_-10px_rgba(251,191,114,0.6)]',
  BLOCKED: 'shadow-[0_0_36px_-10px_rgba(251,113,133,0.6)]',
};

export const rulingDot: Record<string, string> = {
  COMPLIANT: 'bg-compliant',
  FLAGGED: 'bg-flagged',
  BLOCKED: 'bg-blocked',
};
