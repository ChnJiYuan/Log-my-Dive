import type { DiveLog } from '@log-my-dive/core';

/**
 * ShareCard — the visual dive card rendered inside a modal for preview
 * and captured by html2canvas for PNG export.
 *
 * Designed at 360 × 450 px (preview). html2canvas is called with scale=3
 * to produce a 1080 × 1350 px Instagram-friendly portrait output.
 */

interface Props {
  log: DiveLog;
  /** Ref forwarded to the root element so html2canvas can target it. */
  cardRef: React.RefObject<HTMLDivElement>;
}

export function ShareCard({ log, cardRef }: Props) {
  const mood = log.moodRating
    ? '★'.repeat(log.moodRating) + '☆'.repeat(5 - log.moodRating)
    : null;

  const noteText = log.notes
    ? log.notes.length > 120
      ? log.notes.slice(0, 117) + '…'
      : log.notes
    : null;

  const stats: { icon: string; value: string; label: string }[] = [];
  if (log.maxDepth != null)
    stats.push({ icon: '↓', value: `${log.maxDepth}m`, label: 'Max depth' });
  stats.push({ icon: '⏱', value: `${log.durationMinutes}min`, label: 'Duration' });
  if (log.waterTemperature != null)
    stats.push({ icon: '🌡', value: `${log.waterTemperature}°C`, label: 'Water temp' });
  if (log.visibility != null)
    stats.push({ icon: '👁', value: `${log.visibility}m`, label: 'Visibility' });

  return (
    <div ref={cardRef} style={card}>
      {/* Ocean gradient background */}
      <div style={bg} />

      {/* Decorative bubbles */}
      <Bubble size={180} top={-40} right={-40} opacity={0.06} />
      <Bubble size={100} top={120} left={-30} opacity={0.05} />
      <Bubble size={60} bottom={200} right={20} opacity={0.07} />

      {/* Content */}
      <div style={content}>
        {/* Wordmark */}
        <div style={wordmark}>
          <span style={wordmarkIcon}>🤿</span>
          <span style={wordmarkText}>Log my Dive</span>
        </div>

        {/* Divider */}
        <div style={divider} />

        {/* Location */}
        <p style={location}>{log.locationName}</p>
        <p style={dateText}>{formatDate(log.date)}</p>

        {/* Entry / exit times */}
        <p style={times}>
          {log.entryTime} → {log.exitTime}
        </p>

        {/* Stats grid */}
        {stats.length > 0 && (
          <div style={statsGrid}>
            {stats.map((s) => (
              <div key={s.label} style={statBox}>
                <span style={statIcon}>{s.icon}</span>
                <span style={statValue}>{s.value}</span>
                <span style={statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Dive type / condition pills */}
        {(log.diveType || log.seaCondition) && (
          <div style={pills}>
            {log.diveType && <span style={pill}>{log.diveType}</span>}
            {log.seaCondition && (
              <span style={pill}>{log.seaCondition.replace('_', ' ')}</span>
            )}
          </div>
        )}

        {/* Buddy */}
        {log.buddy && (
          <p style={buddyText}>👤 {log.buddy}</p>
        )}

        {/* Note */}
        {noteText && (
          <>
            <div style={{ ...divider, marginTop: 16, marginBottom: 12, opacity: 0.3 }} />
            <p style={note}>"{noteText}"</p>
          </>
        )}

        {/* Mood */}
        {mood && <p style={moodText}>{mood}</p>}
      </div>

      {/* Footer */}
      <div style={footer}>
        <span style={footerText}>logmydive.app</span>
        <span style={footerDot}>·</span>
        <span style={footerText}>{log.date}</span>
      </div>
    </div>
  );
}

function Bubble({
  size, top, bottom, left, right, opacity,
}: {
  size: number; top?: number; bottom?: number; left?: number; right?: number; opacity: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size, height: size,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.4)',
        top, bottom, left, right,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ── Styles ─────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  position: 'relative',
  width: 360,
  height: 450,
  borderRadius: 20,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const bg: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(155deg, #0A2342 0%, #0d3060 45%, #0e4080 100%)',
};

const content: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  padding: '24px 24px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
};

const wordmark: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 16,
};

const wordmarkIcon: React.CSSProperties = { fontSize: 16 };

const wordmarkText: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.5)',
  letterSpacing: 1,
  textTransform: 'uppercase',
};

const divider: React.CSSProperties = {
  width: 40,
  height: 2,
  background: '#4FC3F7',
  borderRadius: 2,
  marginBottom: 14,
};

const location: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 800,
  color: '#FFFFFF',
  margin: 0,
  lineHeight: 1.2,
  letterSpacing: '-0.5px',
};

const dateText: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.55)',
  margin: '6px 0 2px',
};

const times: React.CSSProperties = {
  fontSize: 14,
  color: '#4FC3F7',
  fontWeight: 600,
  margin: '0 0 16px',
  letterSpacing: 0.5,
};

const statsGrid: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  marginBottom: 12,
};

const statBox: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  borderRadius: 10,
  padding: '8px 12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  minWidth: 68,
};

const statIcon: React.CSSProperties = { fontSize: 14 };

const statValue: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: '#FFFFFF',
  lineHeight: 1,
};

const statLabel: React.CSSProperties = {
  fontSize: 10,
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const pills: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  marginBottom: 8,
};

const pill: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#4FC3F7',
  background: 'rgba(79,195,247,0.12)',
  border: '1px solid rgba(79,195,247,0.3)',
  borderRadius: 20,
  padding: '3px 10px',
  textTransform: 'capitalize',
};

const buddyText: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.5)',
  margin: '4px 0 0',
};

const note: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.65)',
  lineHeight: 1.5,
  fontStyle: 'italic',
  margin: 0,
};

const moodText: React.CSSProperties = {
  fontSize: 15,
  color: '#FF6B6B',
  letterSpacing: 2,
  marginTop: 10,
};

const footer: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 24px 16px',
  borderTop: '1px solid rgba(255,255,255,0.08)',
};

const footerText: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(255,255,255,0.35)',
  fontWeight: 500,
};

const footerDot: React.CSSProperties = {
  color: 'rgba(255,255,255,0.2)',
  fontSize: 11,
};
