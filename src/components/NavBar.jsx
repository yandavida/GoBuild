import { NavLink } from 'react-router-dom';

const CalcIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 6h8M8 10h8M8 14h4M8 18h2" />
  </svg>
);

const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
  </svg>
);

const TABS = [
  { to: '/',      label: 'מחשבון', Icon: CalcIcon,  end: true },
  { to: '/quote', label: 'הצעת מחיר', Icon: QuoteIcon, end: false },
  { to: '/admin', label: 'הגדרות', Icon: AdminIcon, end: false },
];

export default function NavBar() {
  const base = 'flex flex-col items-center gap-1 flex-1 py-2 text-xs font-medium transition-colors duration-150';

  return (
    <nav className="fixed bottom-0 right-0 left-0 z-50 bg-white border-t border-slate-200">
      <div className="max-w-lg w-full mx-auto flex">
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${base} ${isActive ? 'text-brand-700' : 'text-slate-400'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`p-1.5 rounded-xl ${isActive ? 'bg-brand-50' : ''}`}>
                  <Icon />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
