import { useNavigate } from 'react-router-dom';
import { loadLastQuote, generateCNCSpec } from '../store';

function mm(n) {
  return n.toLocaleString('he-IL') + ' מ"מ';
}

function ProfileRow({ item, index }) {
  return (
    <tr className="border-b border-zinc-200 last:border-0 even:bg-zinc-50 print:border-zinc-300">
      <td className="py-2 px-3 text-xs text-zinc-400 font-mono text-center w-8">{index}</td>
      <td className="py-2 px-3 text-sm font-semibold text-zinc-900">{item.label}</td>
      <td className="py-2 px-3 text-sm font-bold text-brand-800 tabular-nums font-mono text-center">
        {mm(item.cutMm)}
      </td>
      <td className="py-2 px-3 text-sm font-bold text-zinc-900 tabular-nums font-mono text-center">
        {item.qty}
      </td>
      <td className="py-2 px-3 text-xs text-zinc-400 font-mono hidden sm:table-cell">{item.note}</td>
    </tr>
  );
}

function BoardRow({ cut, index }) {
  const isFullBoard = cut.widthMm === 1200 && cut.heightMm === 2600;
  return (
    <tr className="border-b border-zinc-200 last:border-0 even:bg-zinc-50 print:border-zinc-300">
      <td className="py-2 px-3 text-xs text-zinc-400 font-mono text-center w-8">{index}</td>
      <td className="py-2 px-3 text-sm font-bold text-brand-800 tabular-nums font-mono text-center">
        {cut.widthMm} × {cut.heightMm} מ"מ
      </td>
      <td className="py-2 px-3 text-sm font-bold text-zinc-900 tabular-nums font-mono text-center">
        {cut.qty}
      </td>
      <td className="py-2 px-3">
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${
          isFullBoard
            ? 'bg-teal-700 text-white'
            : 'bg-amber-600 text-white'
        }`}>
          {cut.note}
        </span>
      </td>
    </tr>
  );
}

export default function CNCSpec() {
  const navigate = useNavigate();
  const saved = loadLastQuote();

  if (!saved) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-64 text-center pt-16">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-14 h-14 mx-auto mb-4 text-zinc-300">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-zinc-800 font-bold text-sm uppercase tracking-wide mb-2">אין נתוני מחיצה</p>
        <p className="text-xs text-zinc-400 mb-8 font-mono">יש לחשב פרויקט תחילה כדי להפיק מפרט CNC</p>
        <button onClick={() => navigate('/')} className="btn-primary max-w-xs">
          עבור למחשבון
        </button>
      </div>
    );
  }

  const {
    projectName,
    length,
    height,
    numDoors = 0,
    doorWidth = 0.9,
    doorHeight = 2.1,
    doubleSided = false,
  } = saved;
  const spec = generateCNCSpec({ length, height, numDoors, doorWidth, doorHeight, doubleSided });
  const today = new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body { background: white !important; font-size: 11pt; }
          header, nav, .no-print { display: none !important; }
          .print-full { max-width: 100% !important; padding: 0 !important; }
          .card { box-shadow: none !important; border: 1px solid #cbd5e1 !important; }
          table { page-break-inside: avoid; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      <div className="page-container print-full">
        {/* Action bar */}
        <div className="flex items-center justify-between mb-4 no-print">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 uppercase tracking-wide"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            חזור לחישוב
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-brand-800 text-white text-xs font-semibold px-4 py-2 rounded-md uppercase tracking-wide border border-brand-900"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9v-2h8v4H6v-2zm9-5a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
            </svg>
            הדפסה / PDF
          </button>
        </div>

        {/* Document header */}
        <div className="card mb-4 bg-[#0f1b2d] text-white border-[#1e3050]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-amber-500 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#0f1b2d]">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                </div>
                <span className="font-bold text-sm tracking-widest uppercase">GoBuild</span>
              </div>
              <h2 className="text-sm font-bold leading-tight uppercase tracking-wide">
                מפרט חיתוך CNC{projectName ? ` – ${projectName}` : ''}
              </h2>
              <p className="text-zinc-400 text-xs mt-1 font-mono">{today}</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-zinc-400 font-mono uppercase tracking-wide">פרטי מחיצה</p>
              <p className="text-sm font-bold font-mono mt-1">{length} מ"ל × {height} מ׳</p>
              {(numDoors ?? 0) > 0 && (
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                  {numDoors} דלת/ות {doorWidth}×{doorHeight} מ׳
                </p>
              )}
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                {doubleSided ? 'ציפוי דו-צדדי' : 'ציפוי חד-צדדי'}
              </p>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-blue-50 border border-blue-300 rounded-md px-3 py-2.5 mb-4 flex items-start gap-2 no-print">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-600 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-blue-800 font-mono">
            מפרט זה מיועד להזמנת חיתוכי CNC של פרופילים מתכתיים במפעל.
            כל המידות בטבלה מבוטאות במילימטרים לדיוק מרבי.
          </p>
        </div>

        {/* Section 1: Profile cuts */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-700">
              <path d="M2 4h2v12H2V4zm14 0h2v12h-2V4zM6 7h8v2H6V7zm0 4h8v2H6v-2z" />
            </svg>
            <p className="text-xs font-bold text-zinc-800 uppercase tracking-wide">סעיף 1 – חיתוכי פרופילים מתכתיים (CNC)</p>
            <span className="badge bg-blue-700 text-white border-blue-800">
              {spec.totalProfilePieces} חתיכות
            </span>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-right" dir="rtl">
              <thead>
                <tr className="bg-zinc-100 border-b-2 border-zinc-300">
                  <th className="py-2 px-3 text-xs font-semibold text-zinc-500 font-mono text-center w-8">#</th>
                  <th className="py-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">סוג פרופיל</th>
                  <th className="py-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">אורך חיתוך</th>
                  <th className="py-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">כמות</th>
                  <th className="py-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden sm:table-cell">הערות</th>
                </tr>
              </thead>
              <tbody>
                {spec.profiles.map((item, i) => (
                  <ProfileRow key={i} item={item} index={i + 1} />
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-zinc-400 mt-3 border-t border-zinc-200 pt-2 font-mono">
            * כל המידות במילימטרים. פרופיל סטאד כולל 10 מ"מ פינוי לרצפה בתחתית.
          </p>
        </div>

        {/* Section 2: Board cutting plan */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-700">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v10h10V5H5zm2 2h6v2H7V7zm0 4h6v2H7v-2z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-bold text-zinc-800 uppercase tracking-wide">סעיף 2 – תוכנית חיתוך לוחות גבס</p>
            <span className="badge bg-indigo-700 text-white border-indigo-800">
              {spec.boards.totalBoards} לוחות
            </span>
          </div>

          <div className="bg-zinc-100 border border-zinc-200 rounded-md px-3 py-2 mb-3 flex gap-4 text-xs text-zinc-600 font-mono">
            <span>לוח תקני: <strong className="text-zinc-900">1200 × 2600 מ"מ</strong></span>
            <span>|</span>
            <span>צדדים: <strong className="text-zinc-900">{spec.boards.sides === 2 ? 'דו-צדדי' : 'חד-צדדי'}</strong></span>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-right" dir="rtl">
              <thead>
                <tr className="bg-zinc-100 border-b-2 border-zinc-300">
                  <th className="py-2 px-3 text-xs font-semibold text-zinc-500 font-mono text-center w-8">#</th>
                  <th className="py-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">מידות חיתוך</th>
                  <th className="py-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">כמות</th>
                  <th className="py-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">סוג</th>
                </tr>
              </thead>
              <tbody>
                {spec.boards.cuts.map((cut, i) => (
                  <BoardRow key={i} cut={cut} index={i + 1} />
                ))}
              </tbody>
            </table>
          </div>

          {(numDoors ?? 0) > 0 && (
            <div className="mt-3 bg-amber-50 border border-amber-300 rounded-md px-3 py-2">
              <p className="text-xs text-amber-800 font-mono">
                ⚠ לוחות סמוך לפתחי דלתות ({numDoors} × {Math.round((doorWidth ?? 0) * 1000)} × {Math.round((doorHeight ?? 0) * 1000)} מ"מ) דורשים חיתוך מותאם בשטח.
                יש להוסיף {numDoors * 2} לוחות נוספים לחיתוכי דלת.
              </p>
            </div>
          )}

          <p className="text-xs text-zinc-400 mt-3 border-t border-zinc-200 pt-2 font-mono">
            * לוחות שלמים אינם דורשים חיתוך CNC. לוחות חתוכים מסומנים עם המידה הסופית הדרושה.
          </p>
        </div>

        {/* Summary card */}
        <div className="card mt-4 bg-[#0f1b2d] text-white border-[#1e3050]">
          <p className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-3">סיכום הזמנה למפעל</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm border-b border-[#1e3050] pb-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wide">סה"כ חתיכות פרופיל לחיתוך CNC</span>
              <span className="font-bold text-white font-mono tabular-nums">{spec.totalProfilePieces} יח'</span>
            </div>
            <div className="flex justify-between text-sm border-b border-[#1e3050] pb-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wide">סה"כ לוחות גבס (כולל חיתוכים)</span>
              <span className="font-bold text-white font-mono tabular-nums">{spec.boards.totalBoards} יח'</span>
            </div>
            {(numDoors ?? 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-xs text-zinc-400 uppercase tracking-wide">לוחות נוספים לפתחי דלתות</span>
                <span className="font-bold text-amber-400 font-mono tabular-nums">{(numDoors ?? 0) * 2} יח' (הערכה)</span>
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-3 border-t border-[#1e3050] pt-3 font-mono">
            מפרט זה הופק על ידי GoBuild · {today}
          </p>
        </div>
      </div>
    </>
  );
}
