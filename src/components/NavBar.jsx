import { NavLink } from 'react-router-dom';

const CalcIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 6h8M8 10h8M8 14h4M8 18h2" />
  </svg>
);

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
  </svg>
);

export default function NavBar() {
  const base = 'flex flex-col items-center gap-1 px-8 py-2 text-xs font-medium transition-colors duration-150';
  const active = 'text-brand-700';
  const inactive = 'text-slate-400';

  return (
    <nav className="fixed bottom-0 right-0 left-0 z-50 bg-white border-t border-slate-200 flex justify-around safe-bottom">
      <div className="max-w-lg w-full mx-auto flex justify-around">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {({ isActive }) => (
            <>
              <span className={`p-1.5 rounded-xl ${isActive ? 'bg-brand-50' : ''}`}>
                <CalcIcon />
              </span>
              <span>מחשבון</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {({ isActive }) => (
            <>
              <span className={`p-1.5 rounded-xl ${isActive ? 'bg-brand-50' : ''}`}>
                <AdminIcon />
              </span>
              <span>הגדרות</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
