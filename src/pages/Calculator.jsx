import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadMaterials, calculateMaterials, CATEGORIES } from '../store';

const CATEGORY_COLORS = {
  'פרופילים': 'bg-blue-50 text-blue-700 border-blue-100',
  'לוחות':    'bg-purple-50 text-purple-700 border-purple-100',
  'ברגים':    'bg-orange-50 text-orange-700 border-orange-100',
  'גימור':    'bg-green-50 text-green-700 border-green-100',
  'אחר':      'bg-slate-50 text-slate-600 border-slate-200',
};

const CATEGORY_ICON = {
  'פרופילים': '🏗️',
  'לוחות':    '📋',
  'ברגים':    '🔩',
  'גימור':    '✨',
  'אחר':      '📦',
};

function InputRow({ label, value, onChange, min = 0, step = 0.1, suffix, hint }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative flex items-center">
        <input
          type="number"
          className="input-field"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          step={step}
          inputMode="decimal"
        />
        {suffix && (
          <span className="absolute left-4 text-slate-400 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function ResultCard({ mat }) {
  const colorClass = CATEGORY_COLORS[mat.category] || CATEGORY_COLORS['אחר'];
  const icon = CATEGORY_ICON[mat.category] || '📦';

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{mat.name}</p>
          {mat.notes && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{mat.notes}</p>
          )}
          <p className="text-xs text-slate-400">בסיס חישוב: {mat.base}</p>
        </div>
      </div>
      <div className="text-left shrink-0 mr-3">
        <p className="text-xl font-bold text-brand-800 tabular-nums">{mat.quantity.toLocaleString('he-IL')}</p>
        <p className="text-xs text-slate-500 text-left">{mat.unit}</p>
      </div>
    </div>
  );
}

export default function Calculator() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [length, setLength] = useState(10);
  const [height, setHeight] = useState(2.6);
  const [numDoors, setNumDoors] = useState(0);
  const [doorWidth, setDoorWidth] = useState(0.9);
  const [doorHeight, setDoorHeight] = useState(2.1);
  const [doubleSided, setDoubleSided] = useState(false);
  const [showDoors, setShowDoors] = useState(false);
  const [activeCategory, setActiveCategory] = useState('הכל');
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState([]);

  const area = useMemo(() => {
    const raw = length * height - numDoors * doorWidth * doorHeight;
    return Math.max(0, raw);
  }, [length, height, numDoors, doorWidth, doorHeight]);

  const effectiveArea = doubleSided ? area * 2 : area;

  function handleCalculate() {
    const materials = loadMaterials();
    const res = calculateMaterials(materials, {
      length, height, numDoors, doorWidth, doorHeight, doubleSided,
    });
    setResults(res);
    setCalculated(true);
  }

  function handleReset() {
    setCalculated(false);
    setResults([]);
    setActiveCategory('הכל');
  }

  const filteredResults = activeCategory === 'הכל'
    ? results
    : results.filter((r) => r.category === activeCategory);

  const usedCategories = ['הכל', ...CATEGORIES.filter((c) => results.some((r) => r.category === c))];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-brand-900">מחשבון מחיצות</h1>
        <p className="text-sm text-slate-500 mt-1">הכנס מידות הפרויקט לחישוב חומרים</p>
      </div>

      {!calculated ? (
        <>
          {/* Project name */}
          <div className="card mb-4">
            <p className="section-title">פרטי פרויקט</p>
            <div>
              <label className="label">שם הפרויקט (אופציונלי)</label>
              <input
                type="text"
                className="input-field"
                placeholder="לדוגמה: דירה ברחוב הרצל"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="card mb-4 space-y-4">
            <p className="section-title">מידות המחיצה</p>

            <InputRow
              label="אורך המחיצה (מ׳)"
              value={length}
              onChange={setLength}
              min={0.1}
              step={0.1}
              suffix='מ"ל'
            />
            <InputRow
              label="גובה המחיצה (מ׳)"
              value={height}
              onChange={setHeight}
              min={0.5}
              step={0.05}
              suffix='מ"'
              hint="גובה תקרה סטנדרטי: 2.6 מ׳"
            />

            {/* Area preview */}
            <div className="bg-brand-50 rounded-xl p-3 flex justify-between items-center">
              <span className="text-sm text-brand-700 font-medium">שטח המחיצה</span>
              <span className="text-lg font-bold text-brand-800">{area.toFixed(2)} מ"ר</span>
            </div>
          </div>

          {/* Cladding type */}
          <div className="card mb-4">
            <p className="section-title">סוג ציפוי</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDoubleSided(false)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-colors ${
                  !doubleSided
                    ? 'border-brand-600 bg-brand-50 text-brand-800'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                חד-צדדי
                <span className="block text-xs font-normal mt-0.5 opacity-70">גבס מצד אחד</span>
              </button>
              <button
                onClick={() => setDoubleSided(true)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-colors ${
                  doubleSided
                    ? 'border-brand-600 bg-brand-50 text-brand-800'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                דו-צדדי
                <span className="block text-xs font-normal mt-0.5 opacity-70">גבס משני הצדדים</span>
              </button>
            </div>
          </div>

          {/* Doors */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="section-title mb-0">פתחי דלתות</p>
              <button
                onClick={() => { setShowDoors(!showDoors); if (showDoors) setNumDoors(0); }}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  showDoors ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {showDoors ? 'ביטול' : '+ הוסף דלתות'}
              </button>
            </div>

            {showDoors && (
              <div className="space-y-4">
                <InputRow
                  label="מספר דלתות"
                  value={numDoors}
                  onChange={setNumDoors}
                  min={0}
                  step={1}
                  suffix="דלתות"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">רוחב דלת (מ׳)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={doorWidth}
                      onChange={(e) => setDoorWidth(Number(e.target.value))}
                      min={0.5}
                      step={0.05}
                      inputMode="decimal"
                    />
                  </div>
                  <div>
                    <label className="label">גובה דלת (מ׳)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={doorHeight}
                      onChange={(e) => setDoorHeight(Number(e.target.value))}
                      min={1}
                      step={0.05}
                      inputMode="decimal"
                    />
                  </div>
                </div>
                {numDoors > 0 && (
                  <div className="bg-amber-50 rounded-xl p-3 flex justify-between text-sm">
                    <span className="text-amber-700">שטח פתחים</span>
                    <span className="font-bold text-amber-800">
                      {(numDoors * doorWidth * doorHeight).toFixed(2)} מ"ר
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary before calc */}
          <div className="card mb-5 bg-brand-900 text-white">
            <p className="text-xs text-brand-200 font-medium mb-2">סיכום לחישוב</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-brand-300">אורך מחיצה</span>
                <span className="font-semibold">{length} מ"ל</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-300">שטח נטו</span>
                <span className="font-semibold">{area.toFixed(2)} מ"ר</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-300">שטח לחישוב לוחות</span>
                <span className="font-semibold">{effectiveArea.toFixed(2)} מ"ר {doubleSided ? '(דו-צ׳)' : ''}</span>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={handleCalculate}>
            חשב חומרים
          </button>
        </>
      ) : (
        <>
          {/* Results */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-brand-900">
                {projectName || 'תוצאות חישוב'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {length} מ"ל × {height} מ׳ | {area.toFixed(1)} מ"ר
              </p>
            </div>
            <button onClick={handleReset} className="btn-secondary text-sm px-4 py-2">
              חישוב חדש
            </button>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {usedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-700 text-white border-brand-700'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Material results grouped by category */}
          {CATEGORIES.filter((c) => filteredResults.some((r) => r.category === c)).map((cat) => {
            const items = filteredResults.filter((r) => r.category === cat);
            return (
              <div key={cat} className="card mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span>{CATEGORY_ICON[cat]}</span>
                  <p className="text-sm font-semibold text-slate-700">{cat}</p>
                  <span className={`badge border ${CATEGORY_COLORS[cat]}`}>{items.length} פריטים</span>
                </div>
                <div>
                  {items.map((mat) => <ResultCard key={mat.id} mat={mat} />)}
                </div>
              </div>
            );
          })}

          {/* Summary + Quote CTA */}
          <div className="card mt-4 bg-slate-800 text-white mb-3">
            <p className="text-xs text-slate-400 font-medium mb-2">סיכום כולל</p>
            <p className="text-sm text-slate-300">{results.length} סוגי חומרים לפרויקט</p>
            <p className="text-xs text-slate-500 mt-2">
              * הכמויות כוללות אחוז בזבוז מקובל בהתאם להגדרות האדמין
            </p>
          </div>

          <button
            onClick={() =>
              navigate('/quote', {
                state: {
                  results,
                  projectName,
                  length,
                  height,
                  area,
                  doubleSided,
                  includeVat: true,
                },
              })
            }
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold rounded-xl px-6 py-4 text-base transition-colors shadow-sm"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            הפק הצעת מחיר ללקוח
          </button>
        </>
      )}
    </div>
  );
}
