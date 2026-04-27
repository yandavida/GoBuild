import { useNavigate } from 'react-router-dom';
import { loadLastQuote, generateCNCSpec } from '../store';

function mm(n) {
  return n.toLocaleString('he-IL') + ' מ"מ';
}

function ProfileRow({ item, index }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 print:border-slate-300">
      <td className="py-2.5 px-3 text-sm text-slate-500 font-mono text-center w-8">{index}</td>
      <td className="py-2.5 px-3 text-sm font-medium text-slate-800">{item.label}</td>
      <td className="py-2.5 px-3 text-sm font-bold text-brand-800 tabular-nums text-center">
        {mm(item.cutMm)}
      </td>
      <td className="py-2.5 px-3 text-sm font-bold text-slate-800 tabular-nums text-center">
        {item.qty}
      </td>
      <td className="py-2.5 px-3 text-xs text-slate-400 hidden sm:table-cell">{item.note}</td>
    </tr>
  );
}

function BoardRow({ cut, index }) {
  const isFullBoard = cut.widthMm === 1200 && cut.heightMm === 2600;
  return (
    <tr className="border-b border-slate-100 last:border-0 print:border-slate-300">
      <td className="py-2.5 px-3 text-sm text-slate-500 font-mono text-center w-8">{index}</td>
      <td className="py-2.5 px-3 text-sm font-bold text-brand-800 tabular-nums text-center">
        {cut.widthMm} × {cut.heightMm} מ"מ
      </td>
      <td className="py-2.5 px-3 text-sm font-bold text-slate-800 tabular-nums text-center">
        {cut.qty}
      </td>
      <td className="py-2.5 px-3">
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
          isFullBoard
            ? 'bg-green-100 text-green-700'
            : 'bg-amber-100 text-amber-700'
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
        <p className="text-5xl mb-4">⚙️</p>
        <p className="text-slate-700 font-semibold mb-2">אין נתוני מחיצה</p>
        <p className="text-sm text-slate-400 mb-8">יש לחשב פרויקט תחילה כדי להפיק מפרט CNC</p>
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
        <div className="flex items-center justify-between mb-5 no-print">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-brand-700 font-medium"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            חזור לחישוב
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9v-2h8v4H6v-2zm9-5a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
            </svg>
            הדפסה / PDF
          </button>
        </div>

        {/* Document header */}
        <div className="card mb-4 bg-brand-900 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-brand-900">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                </div>
                <span className="font-bold text-base">GoBuild</span>
              </div>
              <h2 className="text-lg font-bold leading-tight">
                מפרט חיתוך CNC{projectName ? ` – ${projectName}` : ''}
              </h2>
              <p className="text-brand-300 text-xs mt-1">{today}</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-brand-300">פרטי מחיצה</p>
              <p className="text-sm font-medium mt-1">{length} מ"ל × {height} מ׳</p>
              {(numDoors ?? 0) > 0 && (
                <p className="text-xs text-brand-300 mt-0.5">
                  {numDoors} דלת/ות {doorWidth}×{doorHeight} מ׳
                </p>
              )}
              <p className="text-xs text-brand-300 mt-0.5">
                {doubleSided ? 'ציפוי דו-צדדי' : 'ציפוי חד-צדדי'}
              </p>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2 no-print">
          <span className="text-blue-500 shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs text-blue-700">
            מפרט זה מיועד להזמנת חיתוכי CNC של פרופילים מתכתיים במפעל.
            כל המידות בטבלה מבוטאות במילימטרים לדיוק מרבי.
          </p>
        </div>

        {/* Section 1: Profile cuts */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🏗️</span>
            <p className="text-sm font-semibold text-slate-700">סעיף 1 – חיתוכי פרופילים מתכתיים (CNC)</p>
            <span className="badge bg-blue-50 text-blue-700 border border-blue-100">
              {spec.totalProfilePieces} חתיכות
            </span>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-right" dir="rtl">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-2 px-3 text-xs font-semibold text-slate-400 text-center w-8">#</th>
                  <th className="py-2 px-3 text-xs font-semibold text-slate-400">סוג פרופיל</th>
                  <th className="py-2 px-3 text-xs font-semibold text-slate-400 text-center">אורך חיתוך</th>
                  <th className="py-2 px-3 text-xs font-semibold text-slate-400 text-center">כמות</th>
                  <th className="py-2 px-3 text-xs font-semibold text-slate-400 hidden sm:table-cell">הערות</th>
                </tr>
              </thead>
              <tbody>
                {spec.profiles.map((item, i) => (
                  <ProfileRow key={i} item={item} index={i + 1} />
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-400 mt-3 border-t border-slate-50 pt-3">
            * כל המידות במילימטרים. פרופיל סטאד כולל 10 מ"מ פינוי לרצפה בתחתית.
          </p>
        </div>

        {/* Section 2: Board cutting plan */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📋</span>
            <p className="text-sm font-semibold text-slate-700">סעיף 2 – תוכנית חיתוך לוחות גבס</p>
            <span className="badge bg-purple-50 text-purple-700 border border-purple-100">
              {spec.boards.totalBoards} לוחות
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl px-3 py-2 mb-3 flex gap-4 text-xs text-slate-500">
            <span>גודל לוח תקני: <strong className="text-slate-700">1200 × 2600 מ"מ</strong></span>
            <span>•</span>
            <span>צדדים: <strong className="text-slate-700">{spec.boards.sides === 2 ? 'דו-צדדי' : 'חד-צדדי'}</strong></span>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-right" dir="rtl">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-2 px-3 text-xs font-semibold text-slate-400 text-center w-8">#</th>
                  <th className="py-2 px-3 text-xs font-semibold text-slate-400 text-center">מידות חיתוך</th>
                  <th className="py-2 px-3 text-xs font-semibold text-slate-400 text-center">כמות</th>
                  <th className="py-2 px-3 text-xs font-semibold text-slate-400">סוג</th>
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
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <p className="text-xs text-amber-700">
                ⚠️ לוחות סמוך לפתחי דלתות ({numDoors} × {Math.round((doorWidth ?? 0) * 1000)} × {Math.round((doorHeight ?? 0) * 1000)} מ"מ) דורשים חיתוך מותאם בשטח.
                יש להוסיף {numDoors * 2} לוחות נוספים לחיתוכי דלת.
              </p>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-3 border-t border-slate-50 pt-3">
            * לוחות שלמים אינם דורשים חיתוך CNC. לוחות חתוכים מסומנים עם המידה הסופית הדרושה.
          </p>
        </div>

        {/* Summary card */}
        <div className="card mt-4 bg-slate-800 text-white">
          <p className="text-xs text-slate-400 font-medium mb-3">סיכום הזמנה למפעל</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">סה"כ חתיכות פרופיל לחיתוך CNC</span>
              <span className="font-bold text-white">{spec.totalProfilePieces} יח'</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">סה"כ לוחות גבס (כולל חיתוכים)</span>
              <span className="font-bold text-white">{spec.boards.totalBoards} יח'</span>
            </div>
            {(numDoors ?? 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">לוחות נוספים לפתחי דלתות</span>
                <span className="font-bold text-amber-400">{(numDoors ?? 0) * 2} יח' (הערכה)</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-3 border-t border-slate-600 pt-3">
            מפרט זה הופק על ידי GoBuild · {today}
          </p>
        </div>
      </div>
    </>
  );
}
