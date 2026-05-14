import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import type { DiveLog } from '@log-my-dive/core';
import { ShareCard } from './ShareCard';

interface Props {
  log: DiveLog;
  onClose: () => void;
}

type Step = 'preview' | 'generating' | 'done';

export function ShareModal({ log, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const [step, setStep] = useState<Step>('preview');
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const generate = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    setStep('generating');
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,           // 360×450 → 1080×1350 px
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });
    } catch (err) {
      console.error('html2canvas error', err);
      return null;
    }
  };

  const handleDownload = async () => {
    const blob = await generate();
    if (!blob) { setStep('preview'); return; }
    const url = URL.createObjectURL(blob);
    setPngUrl(url);
    setStep('done');

    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `dive-${log.locationName.replace(/\s+/g, '-').toLowerCase()}-${log.date}.png`;
    a.click();
  };

  const handleShare = async () => {
    const blob = await generate();
    if (!blob) { setStep('preview'); return; }
    const url = URL.createObjectURL(blob);
    setPngUrl(url);
    setStep('done');

    const file = new File([blob], `dive-${log.date}.png`, { type: 'image/png' });
    try {
      await navigator.share({
        title: `Dive at ${log.locationName}`,
        text: `${log.locationName} — ${log.date} · ${log.durationMinutes}min`,
        files: [file],
      });
    } catch {
      // User cancelled or files not supported — fall back to download
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div style={s.backdrop} onClick={onClose} />

      {/* Modal */}
      <div style={s.modal}>
        <div style={s.header}>
          <p style={s.title}>Share dive card</p>
          <button style={s.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Card preview */}
        <div style={s.previewWrap}>
          <ShareCard log={log} cardRef={cardRef} />
        </div>

        {/* Actions */}
        <div style={s.actions}>
          {step === 'preview' && (
            <>
              {canNativeShare && (
                <button style={s.primaryBtn} onClick={handleShare}>
                  Share
                </button>
              )}
              <button
                style={canNativeShare ? s.secondaryBtn : s.primaryBtn}
                onClick={handleDownload}
              >
                Save as PNG
              </button>
            </>
          )}

          {step === 'generating' && (
            <div style={s.generating}>
              <span style={s.spinner} />
              Generating card…
            </div>
          )}

          {step === 'done' && (
            <>
              <p style={s.doneMsg}>✅ Done!</p>
              {pngUrl && (
                <a href={pngUrl} download={`dive-${log.date}.png`} style={s.secondaryBtn}>
                  Download again
                </a>
              )}
              <button style={s.primaryBtn} onClick={onClose}>Close</button>
            </>
          )}
        </div>

        <p style={s.hint}>1080 × 1350 px · Instagram-friendly portrait</p>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    zIndex: 100,
  },
  modal: {
    position: 'fixed',
    bottom: 0, left: '50%',
    transform: 'translateX(-50%)',
    width: '100%', maxWidth: 480,
    background: '#F5F8FA',
    borderRadius: '20px 20px 0 0',
    zIndex: 101,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: '20px 20px 32px',
    boxShadow: '0 -4px 40px rgba(0,0,0,0.2)',
    maxHeight: '92dvh',
    overflowY: 'auto',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17, fontWeight: 700, color: '#0A2342', margin: 0,
  },
  closeBtn: {
    background: '#E8EFF4', border: 'none', borderRadius: '50%',
    width: 32, height: 32, cursor: 'pointer',
    fontSize: 14, color: '#8FA3B1', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  previewWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(10,35,66,0.35)',
    flexShrink: 0,
  },
  actions: {
    width: '100%', display: 'flex', flexDirection: 'column', gap: 10,
  },
  primaryBtn: {
    width: '100%', background: '#FF6B6B', color: '#FFF',
    border: 'none', borderRadius: 12, padding: '14px 0',
    fontSize: 16, fontWeight: 700, cursor: 'pointer',
    textDecoration: 'none', textAlign: 'center',
  },
  secondaryBtn: {
    width: '100%', background: '#0A2342', color: '#FFF',
    border: 'none', borderRadius: 12, padding: '14px 0',
    fontSize: 16, fontWeight: 700, cursor: 'pointer',
    textDecoration: 'none', textAlign: 'center',
    boxSizing: 'border-box', display: 'block',
  },
  generating: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10, fontSize: 15, color: '#0A2342', fontWeight: 600,
    padding: '14px 0',
  },
  spinner: {
    display: 'inline-block',
    width: 18, height: 18,
    border: '2px solid #E0EAF0',
    borderTopColor: '#4FC3F7',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  doneMsg: {
    textAlign: 'center', fontSize: 15, color: '#2E7D32',
    fontWeight: 600, margin: 0,
  },
  hint: {
    fontSize: 11, color: '#B0C4D4', margin: 0,
  },
};
