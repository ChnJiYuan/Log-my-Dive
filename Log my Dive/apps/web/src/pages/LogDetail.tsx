import { useParams, Link } from 'react-router-dom';

export function LogDetail() {
  const { id } = useParams<{ id: string }>();
  // TODO (M5): fetch from DiveLogRepository.getById(id)
  return (
    <div style={{ padding: 16 }}>
      <Link to="/" style={{ color: '#4FC3F7', fontSize: 14 }}>← Back</Link>
      <h1 style={{ marginTop: 16, color: '#0A2342' }}>Dive Log #{id}</h1>
      <p style={{ color: '#8FA3B1', marginTop: 8 }}>
        Detail view — wire to DiveLogRepository in Milestone 5.
      </p>
    </div>
  );
}
