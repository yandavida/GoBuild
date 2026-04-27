import { NavLink } from 'react-router-dom';

const CalcIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <path d="M8 6h8M8 10h8M8 14h4M8 18h2" />
  </svg>
);

const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
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
  const base = 'flex flex-col items-center gap-1 flex-1 py-2.5 text-xs font-medium tracking-wide transition-colors duration-150 uppercase';

  return (
    <nav className="fixed bottom-0 right-0 left-0 z-50 bg-[#0f1b2d] border-t border-[#1e3050]">
      <div className="max-w-lg w-full mx-auto flex">
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${base} ${isActive ? 'text-amber-400 border-t-2 border-amber-400 -mt-px' : 'text-zinc-500 border-t-2 border-transparent -mt-px'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon />
                <span className={isActive ? 'text-amber-400' : 'text-zinc-500'}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
