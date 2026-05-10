import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Home } from './pages/Home';
import { LogDetail } from './pages/LogDetail';
import { CreateLog } from './pages/CreateLog';
import { EditLog } from './pages/EditLog';
import { ImportPage } from './pages/ImportPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';

const NAV_ITEMS = [
  { to: '/',        label: '🌊 Logs'     },
  { to: '/import',  label: '📥 Import'   },
  { to: '/stats',   label: '📊 Stats'    },
  { to: '/settings',label: '⚙️ Settings' },
];

export function App() {
  return (
    <BrowserRouter>
      <div style={styles.shell}>
        {/* Top header */}
        <header style={styles.header}>
          <span style={styles.logo}>Log my Dive</span>
        </header>

        {/* Page content */}
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log/create" element={<CreateLog />} />
            <Route path="/log/:id/edit" element={<EditLog />} />
            <Route path="/log/:id" element={<LogDetail />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {/* Bottom nav (mobile-first) */}
        <nav style={styles.nav}>
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                ...styles.navItem,
                color: isActive ? '#FF6B6B' : '#8FA3B1',
                borderTop: isActive ? '2px solid #FF6B6B' : '2px solid transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </BrowserRouter>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    maxWidth: 480,
    margin: '0 auto',
    background: '#F5F8FA',
  },
  header: {
    background: '#0A2342',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
  },
  nav: {
    display: 'flex',
    background: '#FFFFFF',
    borderTop: '1px solid #E8EFF4',
    position: 'sticky',
    bottom: 0,
  },
  navItem: {
    flex: 1,
    padding: '12px 4px 10px',
    textAlign: 'center',
    textDecoration: 'none',
    fontSize: 12,
    fontWeight: 600,
    transition: 'color 0.15s',
  },
};
