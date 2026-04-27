// Default material configurations per 100 units
export const DEFAULT_MATERIALS = [
  // --- Profiles (per 100 linear meters) ---
  {
    id: 'm1',
    name: 'מסילה (ראנר)',
    category: 'פרופילים',
    quantityPer100: 200,
    basedOn: 'linear',
    unit: 'מ"ל',
    notes: 'עליונה + תחתונה',
  },
  {
    id: 'm2',
    name: 'פרופיל אנכי (סטאד)',
    category: 'פרופילים',
    quantityPer100: 167,
    basedOn: 'linear',
    unit: 'יחידות',
    notes: 'ריווח 60 ס"מ',
  },
  {
    id: 'm3',
    name: 'זווית פנים / חוץ',
    category: 'פרופילים',
    quantityPer100: 15,
    basedOn: 'linear',
    unit: 'מ"ל',
    notes: 'לפינות',
  },
  // --- Boards (per 100 m²) ---
  {
    id: 'm4',
    name: 'לוחות גבס 120×260',
    category: 'לוחות',
    quantityPer100: 33,
    basedOn: 'area',
    unit: 'לוחות',
    notes: 'כולל 10% בזבוז',
  },
  // --- Screws (per 100 m²) ---
  {
    id: 'm5',
    name: 'ברגי TN (גבס לפרופיל)',
    category: 'ברגים',
    quantityPer100: 600,
    basedOn: 'area',
    unit: 'ברגים',
    notes: 'מ"מ 3.5×25',
  },
  {
    id: 'm6',
    name: 'ברגי TE (פרופיל למסילה)',
    category: 'ברגים',
    quantityPer100: 680,
    basedOn: 'linear',
    unit: 'ברגים',
    notes: 'מ"מ 4.2×13',
  },
  // --- Finishing (per 100 m²) ---
  {
    id: 'm7',
    name: 'טייפ (סרט חיזוק)',
    category: 'גימור',
    quantityPer100: 55,
    basedOn: 'area',
    unit: 'מ"ל',
    notes: 'לתפרים ופינות',
  },
  {
    id: 'm8',
    name: 'פסטה / שפכטל',
    category: 'גימור',
    quantityPer100: 25,
    basedOn: 'area',
    unit: 'ק"ג',
    notes: 'לגימור תפרים',
  },
  {
    id: 'm9',
    name: 'פינות אלומיניום (קורנרביד)',
    category: 'גימור',
    quantityPer100: 12,
    basedOn: 'area',
    unit: 'מ"ל',
    notes: 'לפינות חיצוניות',
  },
  // --- Other (per 100 m²) ---
  {
    id: 'm10',
    name: 'בידוד אקוסטי (צמר סלע)',
    category: 'אחר',
    quantityPer100: 100,
    basedOn: 'area',
    unit: 'מ"ר',
    notes: 'אופציונלי',
  },
];

const STORAGE_KEY = 'gobuild_materials';

export function loadMaterials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_MATERIALS;
}

export function saveMaterials(materials) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
}

export function resetMaterials() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MATERIALS));
  return DEFAULT_MATERIALS;
}

// Calculate quantities for a project
export function calculateMaterials(materials, { length, height, numDoors, doorWidth, doorHeight, doubleSided }) {
  const linearMeters = length;
  const wallArea = Math.max(0, length * height - numDoors * doorWidth * doorHeight);
  const effectiveArea = doubleSided ? wallArea * 2 : wallArea;

  return materials.map((mat) => {
    const base = mat.basedOn === 'linear' ? linearMeters : effectiveArea;
    const raw = (base / 100) * mat.quantityPer100;
    const quantity = Math.ceil(raw);
    return { ...mat, quantity, base: mat.basedOn === 'linear' ? `${linearMeters.toFixed(1)} מ"ל` : `${effectiveArea.toFixed(1)} מ"ר` };
  });
}

export const CATEGORIES = ['פרופילים', 'לוחות', 'ברגים', 'גימור', 'אחר'];
export const UNITS = ['מ"ל', 'מ"ר', 'יחידות', 'לוחות', 'ברגים', 'ק"ג', 'גליל', 'שקית'];
