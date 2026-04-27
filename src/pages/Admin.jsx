import { useState, useEffect } from 'react';
import { loadMaterials, saveMaterials, resetMaterials, CATEGORIES, UNITS } from '../store';

const CATEGORY_COLORS = {
  'פרופילים': 'bg-blue-700 text-white',
  'לוחות':    'bg-indigo-700 text-white',
  'ברגים':    'bg-amber-700 text-white',
  'גימור':    'bg-teal-700 text-white',
  'אחר':      'bg-zinc-600 text-white',
};

const EMPTY_MATERIAL = {
  id: '',
  name: '',
  category: 'פרופילים',
  quantityPer100: '',
  basedOn: 'linear',
  unit: 'יחידות',
  notes: '',
  costPrice: '',
  markupPercent: '',
  installationPrice: '',
};

function generateId() {
  return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function PriceInput({ label, value, onChange, suffix, hint }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative flex items-center">
        <input
          type="number"
          className="input-field font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={0}
          step={0.01}
          inputMode="decimal"
          placeholder="0"
        />
        {suffix && (
          <span className="absolute left-3 text-zinc-400 text-xs font-mono pointer-events-none">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-zinc-400 mt-1 font-mono">{hint}</p>}
    </div>
  );
}

function MaterialForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_MATERIAL, ...initial });

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const clientUnitPrice = form.costPrice !== ''
    ? Number(form.costPrice) * (1 + (Number(form.markupPercent) || 0) / 100)
    : null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || form.quantityPer100 === '') return;
    onSave({
      ...form,
      id: form.id || generateId(),
      quantityPer100:    Number(form.quantityPer100)    || 0,
      costPrice:         Number(form.costPrice)         || 0,
      markupPercent:     Number(form.markupPercent)     || 0,
      installationPrice: Number(form.installationPrice) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="label">שם החומר *</label>
        <input
          className="input-field"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder='לדוגמה: מסילה (ראנר)'
          required
        />
      </div>

      {/* Category + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">קטגוריה</label>
          <select
            className="input-field"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">יחידה</label>
          <select
            className="input-field"
            value={form.unit}
            onChange={(e) => set('unit', e.target.value)}
          >
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Calculation base */}
      <div>
        <label className="label">בסיס חישוב</label>
        <div className="grid grid-cols-2 gap-2">
          {['linear', 'area'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => set('basedOn', mode)}
              className={`py-2.5 px-3 rounded-md text-xs font-semibold border-2 uppercase tracking-wide transition-colors text-center ${
                form.basedOn === mode
                  ? 'border-brand-700 bg-brand-800 text-white'
                  : 'border-zinc-300 bg-white text-zinc-600'
              }`}
            >
              {mode === 'linear' ? 'לכל 100 מ"ל' : 'לכל 100 מ"ר'}
              <span className="block text-xs font-normal opacity-70">
                {mode === 'linear' ? 'מטר קווי' : 'מטר רבוע'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity per 100 */}
      <div>
        <label className="label">
          כמות לכל {form.basedOn === 'linear' ? '100 מ"ל' : '100 מ"ר'} *
        </label>
        <div className="relative flex items-center">
          <input
            type="number"
            className="input-field"
            value={form.quantityPer100}
            onChange={(e) => set('quantityPer100', e.target.value)}
            min={0}
            step={0.5}
            inputMode="decimal"
            required
          />
          <span className="absolute left-4 text-slate-400 text-sm pointer-events-none">{form.unit}</span>
        </div>
      </div>

      {/* ── Pricing section ── */}
      <div className="border-t border-zinc-200 pt-4">
        <p className="section-title mb-3">תמחור</p>

        <div className="space-y-3">
          <PriceInput
            label="מחיר עלות ספק (ליחידה)"
            value={form.costPrice}
            onChange={(v) => set('costPrice', v)}
            suffix="₪"
            hint={`מחיר קנייה לכל ${form.unit}`}
          />

          <PriceInput
            label="תוספת רווח (%)"
            value={form.markupPercent}
            onChange={(v) => set('markupPercent', v)}
            suffix="%"
          />

          {/* Derived client price preview */}
          {clientUnitPrice !== null && clientUnitPrice > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-md px-3 py-2.5 flex justify-between items-center">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">מחיר ללקוח (ליחידה)</span>
              <span className="text-sm font-bold text-amber-900 font-mono tabular-nums">
                ₪{clientUnitPrice.toFixed(2)}
              </span>
            </div>
          )}

          <PriceInput
            label="מחיר התקנה (ליחידה)"
            value={form.installationPrice}
            onChange={(v) => set('installationPrice', v)}
            suffix="₪"
            hint={`עלות התקנה לכל ${form.unit}`}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="label">הערות (אופציונלי)</label>
        <input
          className="input-field"
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder='לדוגמה: כולל 10% בזבוז'
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button type="submit" className="btn-primary flex-1 py-3">
          {initial.id ? 'עדכן חומר' : 'הוסף חומר'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary px-5 py-3">
          ביטול
        </button>
      </div>
    </form>
  );
}

function MaterialRow({ mat, onEdit, onDelete }) {
  const clientPrice = mat.costPrice * (1 + (mat.markupPercent || 0) / 100);
  const hasPricing = mat.costPrice > 0;

  return (
    <div className="py-3 border-b border-zinc-100 last:border-0">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-zinc-900">{mat.name}</p>
            <span className={`badge text-xs ${CATEGORY_COLORS[mat.category] || ''}`}>
              {mat.category}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 font-mono">
            {mat.quantityPer100} {mat.unit} / 100 {mat.basedOn === 'linear' ? 'מ"ל' : 'מ"ר'}
            {mat.notes && ` · ${mat.notes}`}
          </p>

          {/* Pricing chips */}
          {hasPricing ? (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="text-xs bg-zinc-100 text-zinc-700 border border-zinc-200 rounded px-2 py-0.5 font-mono">
                עלות ₪{mat.costPrice.toFixed(2)}
              </span>
              {mat.markupPercent > 0 && (
                <span className="text-xs bg-zinc-100 text-zinc-700 border border-zinc-200 rounded px-2 py-0.5 font-mono">
                  +{mat.markupPercent}% → ₪{clientPrice.toFixed(2)}
                </span>
              )}
              {mat.installationPrice > 0 && (
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-0.5 font-mono">
                  התקנה ₪{mat.installationPrice.toFixed(2)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-zinc-300 mt-1 block font-mono">ללא תמחור</span>
          )}
        </div>

        <div className="flex gap-1 shrink-0 mt-0.5">
          <button
            onClick={() => onEdit(mat)}
            className="text-brand-700 hover:bg-brand-50 p-2 rounded transition-colors border border-transparent hover:border-brand-200"
            aria-label="עריכה"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(mat.id)}
            className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors border border-transparent hover:border-red-200"
            aria-label="מחיקה"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [materials, setMaterials] = useState([]);
  const [editingMat, setEditingMat] = useState(null);
  const [filterCat, setFilterCat] = useState('הכל');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMaterials(loadMaterials());
  }, []);

  function persist(updated) {
    setMaterials(updated);
    saveMaterials(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSave(mat) {
    const idx = materials.findIndex((m) => m.id === mat.id);
    const updated = idx >= 0
      ? materials.map((m) => (m.id === mat.id ? mat : m))
      : [...materials, mat];
    persist(updated);
    setEditingMat(null);
  }

  function handleDelete(id) {
    persist(materials.filter((m) => m.id !== id));
  }

  function handleReset() {
    const def = resetMaterials();
    setMaterials(def);
    setShowResetConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const pricedCount = materials.filter((m) => m.costPrice > 0).length;
  const usedCats = ['הכל', ...CATEGORIES.filter((c) => materials.some((m) => m.category === c))];
  const filtered = filterCat === 'הכל' ? materials : materials.filter((m) => m.category === filterCat);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-zinc-300">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">הגדרות חומרים</h1>
            <p className="text-xs text-zinc-500 mt-0.5 font-mono">כמויות + תמחור לכל 100 מ"ל / מ"ר</p>
          </div>
          {saved && (
            <span className="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded uppercase tracking-wide shrink-0">
              ✓ נשמר
            </span>
          )}
        </div>

        {/* Pricing status banner */}
        {pricedCount < materials.length && (
          <div className="mt-3 bg-amber-50 border border-amber-300 rounded-md px-3 py-2.5 flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-600 shrink-0">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-amber-800 font-mono">
              {materials.length - pricedCount} חומרים ללא מחיר עלות — הצעת המחיר תהיה חלקית
            </p>
          </div>
        )}
      </div>

      {/* Form */}
      {editingMat !== null ? (
        <div className="card mb-4">
          <p className="section-title">{editingMat.id ? 'עריכת חומר' : 'הוספת חומר חדש'}</p>
          <MaterialForm
            initial={editingMat}
            onSave={handleSave}
            onCancel={() => setEditingMat(null)}
          />
        </div>
      ) : (
        <button
          onClick={() => setEditingMat({})}
          className="btn-primary mb-4 flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          הוסף חומר חדש
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'פרופילים', count: materials.filter((m) => m.category === 'פרופילים').length },
          { label: 'לוחות',    count: materials.filter((m) => m.category === 'לוחות').length },
          { label: 'ברגים',   count: materials.filter((m) => m.category === 'ברגים').length },
        ].map(({ label, count }) => (
          <div key={label} className="card text-center py-3 px-2">
            <p className="text-xl font-bold text-brand-800 font-mono tabular-nums">{count}</p>
            <p className="text-xs text-zinc-500 mt-0.5 uppercase tracking-wide font-semibold">{label}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
        {usedCats.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md border uppercase tracking-wide transition-colors ${
              filterCat === cat
                ? 'bg-brand-800 text-white border-brand-800'
                : 'bg-white text-zinc-600 border-zinc-300'
            }`}
          >
            {cat}
            <span className="mr-1 opacity-70">
              ({cat === 'הכל' ? materials.length : materials.filter((m) => m.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Materials list */}
      {CATEGORIES.filter((c) => filtered.some((m) => m.category === c)).map((cat) => (
        <div key={cat} className="card mb-3">
          <p className="section-title">{cat}</p>
          {filtered.filter((m) => m.category === cat).map((mat) => (
            <MaterialRow
              key={mat.id}
              mat={mat}
              onEdit={(m) => setEditingMat(m)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="card text-center py-10 text-zinc-400 border-dashed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 mx-auto mb-3 text-zinc-300">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-semibold uppercase tracking-wide">אין חומרים בקטגוריה זו</p>
        </div>
      )}

      {/* Reset */}
      <div className="card mt-6 border-red-200">
        <p className="section-title text-red-400">איפוס מערכת</p>
        {showResetConfirm ? (
          <div>
            <p className="text-xs text-zinc-600 mb-4 font-mono">
              פעולה זו תאפס את כל הגדרות החומרים לברירות המחדל. לא ניתן לשחזר שינויים קודמים.
            </p>
            <div className="flex gap-3">
              <button onClick={handleReset} className="flex-1 py-2.5 rounded-md bg-red-600 text-white font-semibold text-xs uppercase tracking-wide">
                אפס הכל
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="btn-secondary flex-1 py-2.5">
                ביטול
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 rounded-md border-2 border-red-200 text-red-500 font-semibold text-xs uppercase tracking-wide hover:bg-red-50 transition-colors"
          >
            חזור לברירות מחדל
          </button>
        )}
      </div>
    </div>
  );
}
