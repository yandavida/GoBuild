import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadLastQuote, VAT_RATE } from '../store';

const fmt = (n) =>
  n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function QuoteRow({ mat, index }) {
  const hasPrice = mat.costPrice > 0 || mat.installationPrice > 0;

  return (
    <div className={`py-3 border-b border-zinc-100 last:border-0 ${!hasPrice ? 'opacity-40' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono w-5 shrink-0">{index}.</span>
            <p className="text-sm font-semibold text-zinc-900 leading-snug">{mat.name}</p>
          </div>
          {mat.notes && (
            <p className="text-xs text-zinc-400 mt-0.5 pr-7 font-mono">{mat.notes}</p>
          )}
        </div>
        <div className="text-left shrink-0">
          <p className="text-sm font-bold text-zinc-900 tabular-nums font-mono">
            {mat.quantity.toLocaleString('he-IL')}
            <span className="text-xs font-normal text-zinc-500 mr-1">{mat.unit}</span>
          </p>
        </div>
      </div>

      {hasPrice && (
        <div className="mt-2 pr-7 grid grid-cols-3 gap-1 text-xs">
          <div className="bg-zinc-100 border border-zinc-200 rounded-md p-2 text-center">
            <p className="text-zinc-500 uppercase tracking-wide text-xs font-semibold">חומר/יח'</p>
            <p className="font-bold text-zinc-800 mt-0.5 font-mono">
              {mat.clientUnitPrice > 0 ? `₪${fmt(mat.clientUnitPrice)}` : '—'}
            </p>
          </div>
          <div className="bg-zinc-100 border border-zinc-200 rounded-md p-2 text-center">
            <p className="text-zinc-500 uppercase tracking-wide text-xs font-semibold">התקנה/יח'</p>
            <p className="font-bold text-zinc-800 mt-0.5 font-mono">
              {mat.installationPrice > 0 ? `₪${fmt(mat.installationPrice)}` : '—'}
            </p>
          </div>
          <div className="bg-brand-800 border border-brand-900 rounded-md p-2 text-center">
            <p className="text-brand-200 uppercase tracking-wide text-xs font-semibold">סה"כ שורה</p>
            <p className="font-bold text-white mt-0.5 font-mono">₪{fmt(mat.lineTotal)}</p>
          </div>
        </div>
      )}

      {!hasPrice && (
        <p className="text-xs text-zinc-300 pr-7 mt-1 font-mono">לא הוגדר מחיר — אינו כלול בסיכום</p>
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
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-zinc-600 py-1.5 border-b border-zinc-100">
        <span className="text-xs uppercase tracking-wide font-semibold">סה"כ חומרים</span>
        <span className="font-bold font-mono tabular-nums">₪{fmt(subtotalMaterials)}</span>
      </div>
      <div className="flex justify-between text-sm text-zinc-600 py-1.5 border-b border-zinc-100">
        <span className="text-xs uppercase tracking-wide font-semibold">סה"כ התקנה</span>
        <span className="font-bold font-mono tabular-nums">₪{fmt(subtotalInstallation)}</span>
      </div>
      <div className="flex justify-between text-sm text-zinc-800 font-bold py-1.5 border-b border-zinc-200">
        <span className="text-xs uppercase tracking-wide">סכום לפני מע"מ</span>
        <span className="font-mono tabular-nums">₪{fmt(subtotal)}</span>
      </div>
      {includeVat && (
        <div className="flex justify-between text-sm text-zinc-500 py-1.5">
          <span className="text-xs uppercase tracking-wide">מע"מ ({(VAT_RATE * 100).toFixed(0)}%)</span>
          <span className="font-mono tabular-nums">₪{fmt(vat)}</span>
        </div>
      )}
      <div className="bg-[#0f1b2d] border border-[#1e3050] rounded-md p-4 flex justify-between items-center mt-2">
        <span className="text-zinc-300 font-semibold text-xs uppercase tracking-widest">סה"כ לתשלום</span>
        <span className="text-white font-bold text-xl tabular-nums font-mono">₪{fmt(total)}</span>
      </div>
    </div>
  );
}

export default function Quote() {
  const navigate = useNavigate();
  const saved = loadLastQuote();

  const [includeVat, setIncludeVat] = useState(saved?.includeVat ?? true);

  if (!saved) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-64 text-center pt-16">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-14 h-14 mx-auto mb-4 text-zinc-300">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-zinc-800 font-bold text-sm uppercase tracking-wide mb-2">אין הצעת מחיר עדיין</p>
        <p className="text-xs text-zinc-400 mb-8 font-mono">יש לחשב פרויקט תחילה ואז תוכן ההצעה יופיע כאן</p>
        <button onClick={() => navigate('/')} className="btn-primary max-w-xs">
          עבור למחשבון
        </button>
      </div>
    );
  }

  const { results, projectName, length, height, area, doubleSided } = saved;
  const unpricedCount = results.filter((r) => r.costPrice === 0 && r.installationPrice === 0).length;
  const today = new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="page-container">
      {/* Actions bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-300">
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

      {/* Quote header */}
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
              {projectName || 'הצעת מחיר'}
            </h2>
            <p className="text-zinc-400 text-xs mt-1 font-mono">{today}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wide">פרטי פרויקט</p>
            <p className="text-sm font-bold font-mono mt-1">{length} מ"ל × {height} מ׳</p>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              {area.toFixed(1)} מ"ר {doubleSided ? '(דו-צדדי)' : '(חד-צדדי)'}
            </p>
          </div>
        </div>
      </div>

      {/* Unpriced warning */}
      {unpricedCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-md px-3 py-2.5 mb-4 flex items-start gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-600 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-amber-800 font-mono">
            {unpricedCount} חומרים ללא מחיר לא נכללים בסיכום. ניתן להגדיר מחירים בעמוד ההגדרות.
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
            <p className="text-xs font-bold text-zinc-800 uppercase tracking-wide">כלול מע"מ ({(VAT_RATE * 100).toFixed(0)}%)</p>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">הוספת מע"מ לסיכום הסופי</p>
          </div>
          <button
            onClick={() => setIncludeVat((v) => !v)}
            className={`relative w-11 h-5 rounded-sm transition-colors ${includeVat ? 'bg-brand-700' : 'bg-zinc-300'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-sm shadow transition-all ${includeVat ? 'right-0.5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="card mb-4">
        <p className="section-title">סיכום כספי</p>
        <TotalsCard results={results} includeVat={includeVat} />
      </div>

      <p className="text-xs text-center text-zinc-400 mt-2 mb-4 font-mono">
        הצעת מחיר זו תקפה ל-30 יום מתאריך ההפקה
      </p>
    </div>
  );
}
