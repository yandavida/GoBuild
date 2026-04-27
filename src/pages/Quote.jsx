import { useLocation, useNavigate } from 'react-router-dom';
import { VAT_RATE } from '../store';

const fmt = (n) =>
  n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function QuoteRow({ mat, index }) {
  const hasPrice = mat.costPrice > 0 || mat.installationPrice > 0;

  return (
    <div className={`py-3 border-b border-slate-100 last:border-0 ${!hasPrice ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono w-5 shrink-0">{index}.</span>
            <p className="text-sm font-medium text-slate-800 leading-snug">{mat.name}</p>
          </div>
          {mat.notes && (
            <p className="text-xs text-slate-400 mt-0.5 pr-7">{mat.notes}</p>
          )}
        </div>
        <div className="text-left shrink-0">
          <p className="text-sm font-bold text-slate-800 tabular-nums">
            {mat.quantity.toLocaleString('he-IL')}
            <span className="text-xs font-normal text-slate-500 mr-1">{mat.unit}</span>
          </p>
        </div>
      </div>

      {/* Price breakdown */}
      {hasPrice && (
        <div className="mt-2 pr-7 grid grid-cols-3 gap-1 text-xs">
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-slate-400">חומר/יח'</p>
            <p className="font-semibold text-slate-700 mt-0.5">
              {mat.clientUnitPrice > 0 ? `₪${fmt(mat.clientUnitPrice)}` : '—'}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-slate-400">התקנה/יח'</p>
            <p className="font-semibold text-slate-700 mt-0.5">
              {mat.installationPrice > 0 ? `₪${fmt(mat.installationPrice)}` : '—'}
            </p>
          </div>
          <div className="bg-brand-50 rounded-lg p-2 text-center">
            <p className="text-brand-500">סה"כ שורה</p>
            <p className="font-bold text-brand-800 mt-0.5">₪{fmt(mat.lineTotal)}</p>
          </div>
        </div>
      )}

      {!hasPrice && (
        <p className="text-xs text-slate-300 pr-7 mt-1">לא הוגדר מחיר — אינו כלול בסיכום</p>
      )}
    </div>
  );
}

function TotalsCard({ results, includeVat }) {
  const subtotalMaterials = results.reduce((s, r) => s + r.totalMaterialCost, 0);
  const subtotalInstallation = results.reduce((s, r) => s + r.totalInstallationCost, 0);
  const subtotal = subtotalMaterials + subtotalInstallation;
  const vat = includeVat ? subtotal * VAT_RATE : 0;
  const total = subtotal + vat;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-600 py-1">
        <span>סה"כ חומרים</span>
        <span className="font-medium">₪{fmt(subtotalMaterials)}</span>
      </div>
      <div className="flex justify-between text-sm text-slate-600 py-1">
        <span>סה"כ התקנה</span>
        <span className="font-medium">₪{fmt(subtotalInstallation)}</span>
      </div>
      <div className="border-t border-slate-200 pt-2 flex justify-between text-sm text-slate-700 font-semibold py-1">
        <span>סכום לפני מע"מ</span>
        <span>₪{fmt(subtotal)}</span>
      </div>
      {includeVat && (
        <div className="flex justify-between text-sm text-slate-500 py-1">
          <span>מע"מ ({(VAT_RATE * 100).toFixed(0)}%)</span>
          <span>₪{fmt(vat)}</span>
        </div>
      )}
      <div className="bg-brand-900 rounded-xl p-4 flex justify-between items-center mt-1">
        <span className="text-brand-200 font-medium text-sm">סה"כ לתשלום</span>
        <span className="text-white font-bold text-xl tabular-nums">₪{fmt(total)}</span>
      </div>
    </div>
  );
}

export default function Quote() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state?.results) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-64 text-center">
        <p className="text-4xl mb-4">📄</p>
        <p className="text-slate-600 font-medium mb-2">אין נתונים להצגה</p>
        <p className="text-sm text-slate-400 mb-6">יש לחשב פרויקט תחילה</p>
        <button onClick={() => navigate('/')} className="btn-primary max-w-xs">
          עבור למחשבון
        </button>
      </div>
    );
  }

  const {
    results,
    projectName,
    length,
    height,
    area,
    doubleSided,
    includeVat,
    setIncludeVat,
  } = state;

  const pricedResults = results.filter((r) => r.costPrice > 0 || r.installationPrice > 0);
  const unpricedCount = results.length - pricedResults.length;
  const today = new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });

  function handlePrint() {
    window.print();
  }

  return (
    <div className="page-container">
      {/* Back button + actions */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-brand-700 font-medium"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          חזור לחישוב
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9v-2h8v4H6v-2zm9-5a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
          </svg>
          הדפסה / PDF
        </button>
      </div>

      {/* Quote header card */}
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
              {projectName || 'הצעת מחיר'}
            </h2>
            <p className="text-brand-300 text-xs mt-1">{today}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-brand-300">פרטי פרויקט</p>
            <p className="text-sm font-medium mt-1">{length} מ"ל × {height} מ׳</p>
            <p className="text-xs text-brand-300 mt-0.5">{area.toFixed(1)} מ"ר {doubleSided ? '(דו-צדדי)' : '(חד-צדדי)'}</p>
          </div>
        </div>
      </div>

      {/* Unpriced warning */}
      {unpricedCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
          <span className="text-amber-500 mt-0.5">⚠️</span>
          <p className="text-xs text-amber-700">
            {unpricedCount} חומרים ללא מחיר לא נכללים בסיכום הכספי.
            ניתן להגדיר מחירים בעמוד ההגדרות.
          </p>
        </div>
      )}

      {/* Items */}
      <div className="card mb-4">
        <p className="section-title">פירוט חומרים</p>
        {results.map((mat, i) => (
          <QuoteRow key={mat.id} mat={mat} index={i + 1} />
        ))}
      </div>

      {/* VAT toggle */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">כלול מע"מ ({(VAT_RATE * 100).toFixed(0)}%)</p>
            <p className="text-xs text-slate-400 mt-0.5">הוספת מע"מ לסיכום הסופי</p>
          </div>
          <button
            onClick={() => navigate('.', { state: { ...state, includeVat: !includeVat }, replace: true })}
            className={`relative w-12 h-6 rounded-full transition-colors ${includeVat ? 'bg-brand-600' : 'bg-slate-200'}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${includeVat ? 'right-1' : 'left-1'}`}
            />
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="card mb-4">
        <p className="section-title">סיכום כספי</p>
        <TotalsCard results={results} includeVat={includeVat} />
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-slate-400 mt-2 mb-4">
        הצעת מחיר זו תקפה ל-30 יום מתאריך ההפקה
      </p>
    </div>
  );
}
