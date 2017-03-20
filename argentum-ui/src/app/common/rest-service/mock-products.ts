import { Product } from '../model/product';
import { DRUGSTORE, BEV_NONALC, FOOD_SWEET, CAFFEINE, BEV_ALC, PRODUCTS } from './mock-data';

export const GENERATED_PRODUCTS: Product[] = [
  {
    id: 17,
    name: "Haloperidol Decanoate",
    price: 16.39,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 18,
    name: "Propranolol Hydrochloride",
    price: 14.59,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 19,
    name: "topcare day time nite time cold and flu relief",
    price: 15.41,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 20, name: "ibuprofen", price: 14.11, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 21, name: "Gabapentin", price: 19.53, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 22, name: "Optison", price: 15.4, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 23, name: "Cefaclor", price: 18.91, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 24, name: "Gilotrif", price: 13.7, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 25, name: "Bismatrol", price: 6.89, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 26,
    name: "Potassium Chloride",
    price: 17.02,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 27,
    name: "Perindopril Erbumine",
    price: 9.67,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 28,
    name: "Bull Frog Insta-Cool Mist 50",
    price: 3.26,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 29,
    name: "Cefuroxime Axetil",
    price: 15.32,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 30,
    name: "CD DiorSnow White Reveal UV Shield Foundation 021-Linen",
    price: 8.39,
    category: BEV_ALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 31, name: "Risperidone M-TAB", price: 18.06, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 32, name: "RUTIN", price: 4.52, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 33, name: "Ranitidine", price: 14.56, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 34,
    name: "Phenazopyridine HCl",
    price: 14.55,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 35,
    name: "NARS PURE RADIANT TINTED MOISTURIZER",
    price: 19.73,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 36, name: "BANANA BOAT", price: 16.11, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 37, name: "Hand Sanitizer", price: 12.33, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 38, name: "Coppertone KIDS", price: 5.81, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 39,
    name: "Triamcinolone Acetonide",
    price: 4.12,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 40, name: "Topical", price: 9.8, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 41, name: "Day Time", price: 13.3, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 42, name: "Dexlido Kit", price: 14.84, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 43, name: "Xanax", price: 9.68, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 44,
    name: "Chlorhexidine Gluconate",
    price: 19.7,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 45,
    name: "GOOD NEIGHBOR PHARMACY LUBRICANT EYE DROPS",
    price: 6.41,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 46, name: "topiramate", price: 3.33, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 47, name: "Varicose Veins", price: 12.73, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 48, name: "GABITRIL", price: 19.79, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 49, name: "Longleaf Pine", price: 16.14, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 50,
    name: "AMARANTHUS TUBERCULATUS POLLEN",
    price: 6.37,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 51, name: "VITALUMIERE AQUA", price: 12.16, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 52,
    name: "Minocycline Hydrochloride",
    price: 16.62,
    category: BEV_ALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 53, name: "PANTO A", price: 16.34, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 54,
    name: "CLARINS Broad Spectrum SPF 15 Sunscreen Extra-Firming Foundation Tint 107",
    price: 19.28,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 55, name: "Aspirin", price: 2.35, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 56, name: "Xenical", price: 5.46, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 57, name: "CAREONE", price: 4.57, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 58, name: "AcneFree", price: 9.39, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 59,
    name: "Levalbuterol Hydrochloride",
    price: 2.38,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 60, name: "Amoxapine", price: 1.43, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 61, name: "", price: 16.81, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 62, name: "Etoposide", price: 13.12, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 63,
    name: "Kids Irritated Eye Relief",
    price: 9.91,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 64,
    name: "Amlodipine besylate and Atorvastatin calcium",
    price: 17.73,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 65, name: "Cephalexin", price: 17.91, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 66,
    name: "Cetirizine hydrochloride",
    price: 16.29,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 67, name: "Carvedilol", price: 2.54, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 68,
    name: "Standardized Grass Pollen,  Bluegrass,  Kentucky (June)",
    price: 5.89,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 69,
    name: "Benazepril Hydrochloride",
    price: 15.31,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 70, name: "Cleanoz", price: 2.74, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 71,
    name: "anti-bacterial Hand Cleanser",
    price: 12.26,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 72, name: "Rabeprazole Sodium", price: 17.64, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 73, name: "Gemfibrozil", price: 5.78, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 74, name: "Triple Antibiotic", price: 9.12, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 75, name: "Paroxetine", price: 18.54, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 76, name: "ZENPEP", price: 13.34, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 77,
    name: "Rizatriptan Benzoate",
    price: 18.15,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 78,
    name: "PCXX ONE MINTE GEL COOL PEPPERMINT",
    price: 5.98,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 79, name: "LEVOPHED", price: 5.35, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 80, name: "Adderall", price: 16.99, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 81, name: "Premarin", price: 17.63, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 82, name: "Nitrogen", price: 14.67, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 83,
    name: "No7 Beautifully Matte Foundation Sunscreen Broad Spectrum SPF 15 Deeply Beige",
    price: 2.87,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 84, name: "Ofloxacin Ophthalmic", price: 1.09, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 85, name: "EXCEL SPORT", price: 4.54, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 86, name: "Lamotrigine", price: 14.48, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 87, name: "Female Energy", price: 10.85, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 88,
    name: "Diltiazem Hydrochloride Extended Release",
    price: 6.56,
    category: BEV_ALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 89,
    name: "Birch Juniper Rejuvenation",
    price: 15.43,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 90,
    name: "Toffee Always color stay-on Makeup Broad Spectrum SPF 15",
    price: 11.25,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 91, name: "Simvastatin", price: 3.97, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 92,
    name: "Dental plus Extra Menta",
    price: 19.88,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 93, name: "SEA-CALM", price: 6.1, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 94, name: "Epsom Salts", price: 8.97, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 95,
    name: "MAJOR Extra Strength Gas Relief",
    price: 17.71,
    category: BEV_ALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 96,
    name: "Metoprolol Tartrate",
    price: 18.83,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 97, name: "A PERFECT WORLD", price: 8.49, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 98, name: "hemorrhoidal", price: 15.95, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 99, name: "gas relief", price: 17.82, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 100,
    name: "Amlodipine besylate and Atorvastatin calcium",
    price: 17.0,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 101, name: "CEPHALEXIN", price: 15.38, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 102,
    name: "Childrens Mucinex Multi-Symptom Cold",
    price: 3.95,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 103, name: "Viokace", price: 10.64, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 104, name: "Sulindac", price: 16.33, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 105,
    name: "Beautipharm All Day Moisturizing Balm",
    price: 15.28,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 106,
    name: "FREDS DRY EYE RELIEF",
    price: 7.67,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 107,
    name: "Aurum 30 Special Order",
    price: 14.9,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 108, name: "DELFLEX", price: 19.82, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 109,
    name: "IT RADIANT CC CUSHION",
    price: 7.24,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 110,
    name: "Honey Bisque Foundation SPF 20",
    price: 16.41,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 111, name: "PMS Complex", price: 13.9, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 112,
    name: "SONGYUM New Pinesalt",
    price: 12.37,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 113, name: "Acetaminophen", price: 5.53, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 114,
    name: "Terbinafine Hydrochloride",
    price: 19.28,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 115,
    name: "AllergyEase Nut and Seed",
    price: 18.5,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 116, name: "Thyroplex", price: 2.96, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 117,
    name: "Treatment Set TS340826",
    price: 16.66,
    category: BEV_ALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 118, name: "VenomX", price: 3.33, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 119,
    name: "fluvoxamine maleate",
    price: 15.44,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 120, name: "Russian Thistle", price: 10.31, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 121,
    name: "Givenchy Fluid Foundation Airy-light Mat Radiance SPF 20 Tint 1",
    price: 5.19,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 122, name: "LBEL", price: 3.0, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: true },
  {
    id: 123,
    name: "Lisinopril and Hydrochlorothiazide",
    price: 5.09,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 124, name: "Cytra-K Cystrals", price: 3.76, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 125,
    name: "Neti Mist Sinus Spray",
    price: 18.21,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 126,
    name: "Beyond Antiseptic Mouthwash",
    price: 11.16,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 127, name: "Losartan Potassium", price: 7.69, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 128, name: "ADD", price: 8.42, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 129,
    name: "Family Dollar Antibacterial Hand",
    price: 17.15,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 130, name: "Meloxicam", price: 16.08, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 131, name: "Alprazolam", price: 4.36, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 132,
    name: "Nicardipine Hydrochloride",
    price: 18.13,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 133, name: "migraine relief", price: 11.32, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 134, name: "NEXIUM", price: 15.59, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 135,
    name: "Alcohol Prep Pads Lightweight Non-Sterile",
    price: 3.14,
    category: CAFFEINE,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 136, name: "Lady Speed Stick", price: 7.33, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 137,
    name: "HYDROMORPHONE HYDROCHLORIDE",
    price: 7.46,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 138, name: "Olanzapine", price: 6.13, category: FOOD_SWEET, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 139,
    name: "ENALAPRIL MALEATE",
    price: 10.53,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  {
    id: 140,
    name: "SHISEIDO ADVANCED HYDRO-LIQUID COMPACT (REFILL)",
    price: 10.24,
    category: BEV_ALC,
    ranges: new Set([DRUGSTORE]),
    legacy: true
  },
  { id: 141, name: "PANTOPRAZOLE SODIUM", price: 4.45, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 142, name: "Lamotrigine", price: 8.29, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: false },
  { id: 143, name: "Lice Treatment", price: 2.36, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 144, name: "Bio Impatiens", price: 13.21, category: CAFFEINE, ranges: new Set([DRUGSTORE]), legacy: true },
  { id: 145, name: "Bio Impatiens", price: 16.68, category: BEV_NONALC, ranges: new Set([DRUGSTORE]), legacy: false },
  {
    id: 146,
    name: "Neutrogena Healthy Skin Enhancer",
    price: 4.74,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 147,
    name: "Potassium Chloride in Sodium Chloride",
    price: 9.25,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 148,
    name: "Sudafed PE Pressure plus Pain plus Cough",
    price: 1.13,
    category: BEV_NONALC,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  {
    id: 149,
    name: "Good Neighbor Pharmacy TabTussin",
    price: 12.1,
    category: FOOD_SWEET,
    ranges: new Set([DRUGSTORE]),
    legacy: false
  },
  { id: 150, name: "Gastrolean", price: 10.62, category: BEV_ALC, ranges: new Set([DRUGSTORE]), legacy: true }
];

DRUGSTORE.products = GENERATED_PRODUCTS;

export const ALL_PRODUCTS = PRODUCTS.concat(GENERATED_PRODUCTS);
