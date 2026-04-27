import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadMaterials, calculateMaterials, saveLastQuote, CATEGORIES } from '../store';

const CATEGORY_COLORS = {
  'פרופילים': 'bg-blue-700 text-white border-blue-800',
  'לוחות':    'bg-indigo-700 text-white border-indigo-800',
  'ברגים':    'bg-amber-700 text-white border-amber-800',
  'גימור':    'bg-teal-700 text-white border-teal-800',
  'אחר':      'bg-zinc-600 text-white border-zinc-700',
};

const ProfilesIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M2 4h2v12H2V4zm14 0h2v12h-2V4zM6 7h8v2H6V7zm0 4h8v2H6v-2z" />
  </svg>
);
const BoardsIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v10h10V5H5zm2 2h6v2H7V7zm0 4h6v2H7v-2z" clipRule="evenodd" />
  </svg>
);
const ScrewsIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);
const FinishIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const OtherIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
  </svg>
);

const CATEGORY_ICON = {
  'פרופילים': <ProfilesIcon />,
  'לוחות':    <BoardsIcon />,
  'ברגים':    <ScrewsIcon />,
  'גימור':    <FinishIcon />,
  'אחר':      <OtherIcon />,
};

function InputRow({ label, value, onChange, min = 0, step = 0.1, suffix, hint }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative flex items-center">
        <input
          type="number"
          className="input-field font-mono"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          step={step}
          inputMode="decimal"
        />
        {suffix && (
          <span className="absolute left-3 text-zinc-400 text-xs font-mono pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-zinc-400 mt-1 font-mono">{hint}</p>}
    </div>
  );
}

function ResultCard({ mat }) {
  const icon = CATEGORY_ICON[mat.category] || <OtherIcon />;

  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-zinc-500 shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 truncate">{mat.name}</p>
          {mat.notes && (
            <p className="text-xs text-zinc-400 mt-0.5 truncate font-mono">{mat.notes}</p>
          )}
          <p className="text-xs text-zinc-400 font-mono">בסיס: {mat.base}</p>
        </div>
      </div>
      <div className="text-left shrink-0 mr-3">
        <p className="text-xl font-bold text-brand-800 tabular-nums font-mono">{mat.quantity.toLocaleString('he-IL')}</p>
        <p className="text-xs text-zinc-500 text-left font-mono">{mat.unit}</p>
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
    saveLastQuote({ results: res, projectName, length, height, area, doubleSided, includeVat: true, numDoors, doorWidth, doorHeight });
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
      <div className="mb-4 pb-3 border-b border-zinc-300">
        <h1 className="text-lg font-bold text-zinc-900 tracking-tight uppercase">מחשבון מחיצות</h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-mono">הזן מידות הפרויקט לחישוב כמויות חומרים</p>
      </div>

      {!calculated ? (
        <>
          {/* Project name */}
          <div className="card mb-3">
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
          <div className="card mb-3 space-y-4">
            <p className="section-title">מידות המחיצה</p>

            <InputRow
              label='אורך המחיצה (מ"ל)'
              value={length}
              onChange={setLength}
              min={0.1}
              step={0.1}
              suffix='מ"ל'
            />
            <InputRow
              label='גובה המחיצה (מ")'
              value={height}
              onChange={setHeight}
              min={0.5}
              step={0.05}
              suffix='מ"'
              hint='גובה תקרה סטנדרטי: 2.60 מ׳'
            />

            {/* Area preview */}
            <div className="bg-zinc-100 border border-zinc-300 rounded-md p-3 flex justify-between items-center">
              <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">שטח המחיצה</span>
              <span className="text-base font-bold text-zinc-900 font-mono tabular-nums">{area.toFixed(2)} מ"ר</span>
            </div>
          </div>

          {/* Cladding type */}
          <div className="card mb-3">
            <p className="section-title">סוג ציפוי</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDoubleSided(false)}
                className={`py-2.5 px-3 rounded-md text-xs font-semibold border-2 uppercase tracking-wide transition-colors ${
                  !doubleSided
                    ? 'border-brand-700 bg-brand-800 text-white'
                    : 'border-zinc-300 bg-white text-zinc-600'
                }`}
              >
                חד-צדדי
                <span className="block text-xs font-normal mt-0.5 opacity-70 normal-case tracking-normal">גבס מצד אחד</span>
              </button>
              <button
                onClick={() => setDoubleSided(true)}
                className={`py-2.5 px-3 rounded-md text-xs font-semibold border-2 uppercase tracking-wide transition-colors ${
                  doubleSided
                    ? 'border-brand-700 bg-brand-800 text-white'
                    : 'border-zinc-300 bg-white text-zinc-600'
                }`}
              >
                דו-צדדי
                <span className="block text-xs font-normal mt-0.5 opacity-70 normal-case tracking-normal">גבס משני הצדדים</span>
              </button>
            </div>
          </div>

          {/* Doors */}
          <div className="card mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="section-title mb-0">פתחי דלתות</p>
              <button
                onClick={() => { setShowDoors(!showDoors); if (showDoors) setNumDoors(0); }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md uppercase tracking-wide transition-colors border ${
                  showDoors ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-zinc-600 border-zinc-300'
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
                  suffix="יח'"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">רוחב דלת (מ׳)</label>
                    <input
                      type="number"
                      className="input-field font-mono"
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
                      className="input-field font-mono"
                      value={doorHeight}
                      onChange={(e) => setDoorHeight(Number(e.target.value))}
                      min={1}
                      step={0.05}
                      inputMode="decimal"
                    />
                  </div>
                </div>
                {numDoors > 0 && (
                  <div className="bg-amber-50 border border-amber-300 rounded-md p-3 flex justify-between text-sm">
                    <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">שטח פתחים</span>
                    <span className="font-bold text-amber-900 font-mono tabular-nums">
                      {(numDoors * doorWidth * doorHeight).toFixed(2)} מ"ר
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary before calc */}
          <div className="card mb-4 bg-[#0f1b2d] text-white border-[#1e3050]">
            <p className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-3">סיכום לחישוב</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm border-b border-[#1e3050] pb-2">
                <span className="text-xs text-zinc-400 uppercase tracking-wide">אורך מחיצה</span>
                <span className="font-bold font-mono tabular-nums">{length} מ"ל</span>
              </div>
              <div className="flex justify-between text-sm border-b border-[#1e3050] pb-2">
                <span className="text-xs text-zinc-400 uppercase tracking-wide">שטח נטו</span>
                <span className="font-bold font-mono tabular-nums">{area.toFixed(2)} מ"ר</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-xs text-zinc-400 uppercase tracking-wide">שטח לחישוב לוחות</span>
                <span className="font-bold font-mono tabular-nums">{effectiveArea.toFixed(2)} מ"ר {doubleSided ? '(דו-צ׳)' : ''}</span>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={handleCalculate}>
            חשב כמויות חומרים
          </button>
        </>
      ) : (
        <>
          {/* Results header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-300">
            <div>
              <h2 className="text-base font-bold text-zinc-900 uppercase tracking-tight">
                {projectName || 'תוצאות חישוב'}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                {length} מ"ל × {height} מ׳ | {area.toFixed(1)} מ"ר
              </p>
            </div>
            <button onClick={handleReset} className="btn-secondary text-xs px-4 py-2">
              חישוב חדש
            </button>
          </div>

          {/* Quote CTA */}
          <button
            onClick={() => navigate('/quote')}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-md px-6 py-3.5 text-sm uppercase tracking-wide transition-colors border border-amber-700 mb-2"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            הפק הצעת מחיר ללקוח
          </button>

          {/* CNC Spec CTA */}
          <button
            onClick={() => navigate('/cnc')}
            className="w-full flex items-center justify-center gap-2 bg-brand-800 hover:bg-brand-900 text-white font-bold rounded-md px-6 py-3.5 text-sm uppercase tracking-wide transition-colors border border-brand-900 mb-4"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            הפק מפרט חיתוך CNC
          </button>

          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {usedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md border uppercase tracking-wide transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-800 text-white border-brand-800'
                    : 'bg-white text-zinc-600 border-zinc-300'
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
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500">{CATEGORY_ICON[cat]}</span>
                  <p className="text-xs font-bold text-zinc-700 uppercase tracking-wide">{cat}</p>
                  <span className={`badge border ${CATEGORY_COLORS[cat]}`}>{items.length} פריטים</span>
                </div>
                <div>
                  {items.map((mat) => <ResultCard key={mat.id} mat={mat} />)}
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="card mt-4 bg-[#0f1b2d] text-white border-[#1e3050]">
            <p className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-2">סיכום כולל</p>
            <p className="text-sm text-zinc-300 font-mono">{results.length} סוגי חומרים לפרויקט</p>
            <p className="text-xs text-zinc-500 mt-2 font-mono">
              * הכמויות כוללות אחוז בזבוז מקובל בהתאם להגדרות האדמין
            </p>
          </div>
        </>
      )}
    </div>
  );
}

