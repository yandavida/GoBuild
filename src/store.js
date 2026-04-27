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
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
  },
  {
    id: 'm2',
    name: 'פרופיל אנכי (סטאד)',
    category: 'פרופילים',
    quantityPer100: 167,
    basedOn: 'linear',
    unit: 'יחידות',
    notes: 'ריווח 60 ס"מ',
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
  },
  {
    id: 'm3',
    name: 'זווית פנים / חוץ',
    category: 'פרופילים',
    quantityPer100: 15,
    basedOn: 'linear',
    unit: 'מ"ל',
    notes: 'לפינות',
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
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
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
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
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
  },
  {
    id: 'm6',
    name: 'ברגי TE (פרופיל למסילה)',
    category: 'ברגים',
    quantityPer100: 680,
    basedOn: 'linear',
    unit: 'ברגים',
    notes: 'מ"מ 4.2×13',
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
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
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
  },
  {
    id: 'm8',
    name: 'פסטה / שפכטל',
    category: 'גימור',
    quantityPer100: 25,
    basedOn: 'area',
    unit: 'ק"ג',
    notes: 'לגימור תפרים',
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
  },
  {
    id: 'm9',
    name: 'פינות אלומיניום (קורנרביד)',
    category: 'גימור',
    quantityPer100: 12,
    basedOn: 'area',
    unit: 'מ"ל',
    notes: 'לפינות חיצוניות',
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
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
    costPrice: 0,
    markupPercent: 0,
    installationPrice: 0,
  },
];

const STORAGE_KEY = 'gobuild_materials';
const QUOTE_KEY = 'gobuild_last_quote';

export function saveLastQuote(data) {
  localStorage.setItem(QUOTE_KEY, JSON.stringify(data));
}

export function loadLastQuote() {
  try {
    const raw = localStorage.getItem(QUOTE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function loadMaterials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate older records that lack price fields
      return parsed.map((m) => ({
        costPrice: 0,
        markupPercent: 0,
        installationPrice: 0,
        ...m,
      }));
    }
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

// Calculate quantities (and prices) for a project
export function calculateMaterials(materials, { length, height, numDoors, doorWidth, doorHeight, doubleSided }) {
  const linearMeters = length;
  const wallArea = Math.max(0, length * height - numDoors * doorWidth * doorHeight);
  const effectiveArea = doubleSided ? wallArea * 2 : wallArea;

  return materials.map((mat) => {
    const base = mat.basedOn === 'linear' ? linearMeters : effectiveArea;
    const raw = (base / 100) * mat.quantityPer100;
    const quantity = Math.ceil(raw);

    const clientUnitPrice = mat.costPrice * (1 + (mat.markupPercent || 0) / 100);
    const totalMaterialCost = quantity * clientUnitPrice;
    const totalInstallationCost = quantity * (mat.installationPrice || 0);

    return {
      ...mat,
      quantity,
      base: mat.basedOn === 'linear' ? `${linearMeters.toFixed(1)} מ"ל` : `${effectiveArea.toFixed(1)} מ"ר`,
      clientUnitPrice,
      totalMaterialCost,
      totalInstallationCost,
      lineTotal: totalMaterialCost + totalInstallationCost,
    };
  });
}

export const CATEGORIES = ['פרופילים', 'לוחות', 'ברגים', 'גימור', 'אחר'];
export const UNITS = ['מ"ל', 'מ"ר', 'יחידות', 'לוחות', 'ברגים', 'ק"ג', 'גליל', 'שקית'];

export const VAT_RATE = 0.18;
