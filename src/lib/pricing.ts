import { WindowConfig } from "@/types/window-config";

export interface PriceModifier {
  code: string;
  label: string;
  type: 'multiplier' | 'flat';
  pct?: number; // for multipliers (0.15 = +15%)
  amount?: number; // for flat adds
}

export interface PriceBreakdown {
  base: number;
  multipliers: { label: string; amount: number }[];
  flats: { label: string; amount: number }[];
  subtotal: number;
  total: number;
  multiplierFactor: number;
}

export interface PricingConfig {
  baseRateSqFt: number;
  stackingMode: 'geometric' | 'additive';
  roundTo: number;
  minOrder?: number;
  maxMultiplier?: number;
  modifiers: {
    [key: string]: PriceModifier;
  };
}

// Default pricing configuration
export const DEFAULT_PRICING: PricingConfig = {
  baseRateSqFt: 45.00, // $45 per square foot base
  stackingMode: 'geometric', // geometric stacking for multipliers
  roundTo: 1.00, // round to nearest dollar
  minOrder: 500, // minimum order $500
  maxMultiplier: 2.0, // cap at 2x base price
  modifiers: {
    // Opening type multipliers
    'double-hung': { code: 'double-hung', label: 'Double Hung', type: 'multiplier', pct: 0 },
    'single-hung': { code: 'single-hung', label: 'Single Hung', type: 'multiplier', pct: -0.05 },
    'in-swing': { code: 'in-swing', label: 'In-Swing', type: 'multiplier', pct: 0.10 },
    'out-swing': { code: 'out-swing', label: 'Out-Swing', type: 'multiplier', pct: 0.12 },
    
    // Glass type multipliers
    'triple-pane': { code: 'triple-pane', label: 'Triple Pane Glass', type: 'multiplier', pct: 0.25 },
    'double-pane': { code: 'double-pane', label: 'Double Pane Glass', type: 'multiplier', pct: 0 },
    
    // Thermal break multiplier
    'thermal-break': { code: 'thermal-break', label: 'Thermal Break', type: 'multiplier', pct: 0.15 },
    
    // Color multipliers (non-white)
    'color-premium': { code: 'color-premium', label: 'Premium Color', type: 'multiplier', pct: 0.08 },
    
    // Grid pattern multipliers
    'grid-2-panes': { code: 'grid-2-panes', label: 'Grid Pattern (2 panes)', type: 'multiplier', pct: 0.05 },
    'grid-3-panes': { code: 'grid-3-panes', label: 'Grid Pattern (3 panes)', type: 'multiplier', pct: 0.10 },
    'grid-4-panes': { code: 'grid-4-panes', label: 'Grid Pattern (4 panes)', type: 'multiplier', pct: 0.15 },
    'grid-6-panes': { code: 'grid-6-panes', label: 'Grid Pattern (6 panes)', type: 'multiplier', pct: 0.20 },
    'grid-9-panes': { code: 'grid-9-panes', label: 'Grid Pattern (9 panes)', type: 'multiplier', pct: 0.25 },
    
    // Hardware flat adds
    'hardware-standard': { code: 'hardware-standard', label: 'Standard Hardware', type: 'flat', amount: 0 },
    'hardware-premium': { code: 'hardware-premium', label: 'Premium Hardware', type: 'flat', amount: 150 },
    'hardware-luxury': { code: 'hardware-luxury', label: 'Luxury Hardware', type: 'flat', amount: 350 },
    
    // Screens flat add
    'screens': { code: 'screens', label: 'Window Screens', type: 'flat', amount: 125 },
  }
};

export function calculatePrice(
  config: WindowConfig,
  pricingConfig: PricingConfig = DEFAULT_PRICING
): PriceBreakdown {
  // Calculate area in square feet
  const areaFt2 = (config.width * config.height) / 144; // convert from square inches
  
  // Base price
  const base = areaFt2 * pricingConfig.baseRateSqFt;
  
  // Collect applicable modifiers
  const appliedMultipliers: PriceModifier[] = [];
  const appliedFlats: PriceModifier[] = [];
  
  // Opening type
  const openingMod = pricingConfig.modifiers[config.openingType];
  if (openingMod && openingMod.type === 'multiplier') {
    appliedMultipliers.push(openingMod);
  }
  
  // Glass type
  const glassMod = pricingConfig.modifiers[config.glassType];
  if (glassMod && glassMod.type === 'multiplier') {
    appliedMultipliers.push(glassMod);
  }
  
  // Thermal break
  if (config.thermalBreak) {
    const thermalMod = pricingConfig.modifiers['thermal-break'];
    if (thermalMod) appliedMultipliers.push(thermalMod);
  }
  
  // Color (non-white gets premium charge)
  if (config.color.toLowerCase() !== 'white') {
    const colorMod = pricingConfig.modifiers['color-premium'];
    if (colorMod) appliedMultipliers.push(colorMod);
  }
  
  // Grid pattern (total panes = vertical × horizontal)
  const totalPanes = config.verticalPanes * config.horizontalPanes;
  if (totalPanes > 1) {
    const gridKey = `grid-${totalPanes}-panes`;
    const gridMod = pricingConfig.modifiers[gridKey];
    if (gridMod) {
      appliedMultipliers.push(gridMod);
    } else {
      // For pane counts not in our lookup, use a fallback calculation
      const estimatedPct = 0.05 * (totalPanes - 1);
      appliedMultipliers.push({
        code: `grid-${totalPanes}`,
        label: `Grid Pattern (${totalPanes} panes)`,
        type: 'multiplier',
        pct: Math.min(estimatedPct, 0.30) // cap at 30%
      });
    }
  }
  
  // Hardware
  const hardwareMod = pricingConfig.modifiers[`hardware-${config.hardwareType}`];
  if (hardwareMod && hardwareMod.type === 'flat') {
    appliedFlats.push(hardwareMod);
  }
  
  // Screens
  if (config.screens) {
    const screenMod = pricingConfig.modifiers['screens'];
    if (screenMod) appliedFlats.push(screenMod);
  }
  
  // Calculate multiplier factor
  let factor = 1;
  if (pricingConfig.stackingMode === 'geometric') {
    // Geometric: Π(1 + p_i)
    factor = appliedMultipliers.reduce((acc, mod) => acc * (1 + (mod.pct || 0)), 1);
  } else {
    // Additive: 1 + Σ p_i
    factor = 1 + appliedMultipliers.reduce((acc, mod) => acc + (mod.pct || 0), 0);
  }
  
  // Apply max multiplier cap if set
  if (pricingConfig.maxMultiplier) {
    factor = Math.min(factor, pricingConfig.maxMultiplier);
  }
  
  // Price after multipliers
  const priceAfterMultipliers = base * factor;
  
  // Calculate flat adds
  const flatSum = appliedFlats.reduce((acc, mod) => acc + (mod.amount || 0), 0);
  
  // Total before rounding
  let total = priceAfterMultipliers + flatSum;
  
  // Apply rounding
  if (pricingConfig.roundTo && pricingConfig.roundTo > 0) {
    total = Math.round(total / pricingConfig.roundTo) * pricingConfig.roundTo;
  }
  
  // Apply minimum order
  if (pricingConfig.minOrder) {
    total = Math.max(total, pricingConfig.minOrder);
  }
  
  // Build breakdown
  const breakdown: PriceBreakdown = {
    base: Math.round(base * 100) / 100,
    multipliers: appliedMultipliers
      .filter(m => m.pct !== 0)
      .map(m => ({
        label: `${m.label} (${m.pct! >= 0 ? '+' : ''}${(m.pct! * 100).toFixed(1)}%)`,
        amount: Math.round((base * (m.pct || 0)) * 100) / 100
      })),
    flats: appliedFlats
      .filter(m => (m.amount || 0) > 0)
      .map(m => ({
        label: m.label,
        amount: m.amount || 0
      })),
    subtotal: Math.round(priceAfterMultipliers * 100) / 100,
    total: Math.round(total * 100) / 100,
    multiplierFactor: Math.round(factor * 1000) / 1000
  };
  
  return breakdown;
}