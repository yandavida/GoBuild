import { useState, useEffect } from 'react';
import { loadMaterials, saveMaterials, resetMaterials, CATEGORIES, UNITS } from '../store';

const CATEGORY_COLORS = {
  'פרופילים': 'bg-blue-100 text-blue-700',
  'לוחות':    'bg-purple-100 text-purple-700',
  'ברגים':    'bg-orange-100 text-orange-700',
  'גימור':    'bg-green-100 text-green-700',
  'אחר':      'bg-slate-100 text-slate-600',
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
          className="input-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={0}
          step={0.01}
          inputMode="decimal"
          placeholder="0"
        />
        {suffix && (
          <span className="absolute left-4 text-slate-400 text-sm pointer-events-none">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
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
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-colors text-center ${
                form.basedOn === mode
                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                  : 'border-slate-200 bg-white text-slate-600'
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
      <div className="border-t border-slate-100 pt-4">
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
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-sm text-amber-700">מחיר ללקוח (ליחידה)</span>
              <span className="text-base font-bold text-amber-800">
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
    <div className="py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-slate-800">{mat.name}</p>
            <span className={`badge text-xs ${CATEGORY_COLORS[mat.category] || ''}`}>
              {mat.category}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {mat.quantityPer100} {mat.unit} / 100 {mat.basedOn === 'linear' ? 'מ"ל' : 'מ"ר'}
            {mat.notes && ` · ${mat.notes}`}
          </p>

          {/* Pricing chips */}
          {hasPricing ? (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="text-xs bg-slate-100 text-slate-600 rounded-md px-2 py-0.5">
                עלות ₪{mat.costPrice.toFixed(2)}
              </span>
              {mat.markupPercent > 0 && (
                <span className="text-xs bg-slate-100 text-slate-600 rounded-md px-2 py-0.5">
                  +{mat.markupPercent}% → ₪{clientPrice.toFixed(2)}
                </span>
              )}
              {mat.installationPrice > 0 && (
                <span className="text-xs bg-blue-50 text-blue-600 rounded-md px-2 py-0.5">
                  התקנה ₪{mat.installationPrice.toFixed(2)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-300 mt-1 block">ללא תמחור</span>
          )}
        </div>

        <div className="flex gap-2 shrink-0 mt-0.5">
          <button
            onClick={() => onEdit(mat)}
            className="text-brand-600 hover:bg-brand-50 p-2 rounded-lg transition-colors"
            aria-label="עריכה"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(mat.id)}
            className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
      <div className="mb-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">הגדרות חומרים</h1>
            <p className="text-sm text-slate-500 mt-1">כמויות + תמחור לכל 100 מ"ל / מ"ר</p>
          </div>
          {saved && (
            <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full shrink-0">
              ✓ נשמר
            </span>
          )}
        </div>

        {/* Pricing status banner */}
        {pricedCount < materials.length && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-amber-500 text-lg">⚠️</span>
            <p className="text-xs text-amber-700">
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
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          הוסף חומר חדש
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'פרופילים', count: materials.filter((m) => m.category === 'פרופילים').length },
          { label: 'לוחות',    count: materials.filter((m) => m.category === 'לוחות').length },
          { label: 'ברגים',   count: materials.filter((m) => m.category === 'ברגים').length },
        ].map(({ label, count }) => (
          <div key={label} className="card text-center py-3 px-2">
            <p className="text-xl font-bold text-brand-800">{count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {usedCats.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              filterCat === cat
                ? 'bg-brand-700 text-white border-brand-700'
                : 'bg-white text-slate-600 border-slate-200'
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
        <div className="card text-center py-10 text-slate-400">
          <p className="text-4xl mb-3">📋</p>
          <p>אין חומרים מוגדרים בקטגוריה זו</p>
        </div>
      )}

      {/* Reset */}
      <div className="card mt-6 border-red-100">
        <p className="section-title text-red-400">איפוס</p>
        {showResetConfirm ? (
          <div>
            <p className="text-sm text-slate-600 mb-4">
              פעולה זו תאפס את כל הגדרות החומרים לברירות המחדל. לא ניתן לשחזר שינויים קודמים.
            </p>
            <div className="flex gap-3">
              <button onClick={handleReset} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm">
                אפס הכל
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="btn-secondary flex-1 py-3">
                ביטול
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-xl border-2 border-red-200 text-red-500 font-medium text-sm hover:bg-red-50 transition-colors"
          >
            חזור לברירות מחדל
          </button>
        )}
      </div>
    </div>
  );
}
