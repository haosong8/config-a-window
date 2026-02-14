export type ProductType = "window" | "door";
export type OpeningType = "fixed" | "casement-left" | "casement-right" | "awning" | "hopper" | "in-swing" | "out-swing" | "double-hung" | "single-hung";
export type DoorStyle = "single" | "double" | "sliding" | "bifold";
export type LiteType = "full-lite" | "half-lite" | "solid";
export type GlassType = "double-pane" | "triple-pane";
export type HardwareType = "standard" | "premium" | "luxury";

// Individual window unit in the grid
export interface WindowUnit {
  id: string;           // e.g., "W1.1", "W1.2", "W2.1"
  row: number;          // 1-based row number
  column: number;       // 1-based column number
  openingType: OpeningType;
  width: number;        // Calculated width for this unit
  height: number;       // Height of this row
}

// Row configuration
export interface WindowRow {
  rowNumber: number;
  horizontalUnits: number;  // How many windows in this row
  height: number;           // Height of this row
}

export interface WindowConfig {
  // Product type
  productType: ProductType;
  
  // Overall opening dimensions
  width: number;
  height: number;
  
  // Row-based configuration
  verticalRows: number;     // Number of vertical rows (1-4)
  rows: WindowRow[];        // Configuration per row
  windowUnits: WindowUnit[]; // All individual window units
  selectedWindowId: string | null; // Currently selected window for editing
  
  // Legacy fields for backwards compatibility
  openingType: OpeningType;
  thermalBreak: boolean;
  color: string;
  horizontalUnits: number;
  verticalUnits: number;
  verticalPanes: number;
  horizontalPanes: number;
  glassType: GlassType;
  screens: boolean;
  hardwareType: HardwareType;
  
  // Door-specific fields
  doorStyle: DoorStyle;
  liteType: LiteType;
  doorPanels: number; // Number of panels for sliding/bifold doors (2-8)
}

// Helper to generate window units from row configuration
export function generateWindowUnits(
  rows: WindowRow[], 
  totalWidth: number, 
  totalHeight: number,
  defaultOpeningType: OpeningType = "fixed"
): WindowUnit[] {
  const units: WindowUnit[] = [];
  const totalRowHeights = rows.reduce((sum, row) => sum + row.height, 0);
  
  rows.forEach((row, rowIndex) => {
    const unitWidth = totalWidth / row.horizontalUnits;
    // Distribute height proportionally or equally
    const unitHeight = totalRowHeights > 0 
      ? (row.height / totalRowHeights) * totalHeight 
      : totalHeight / rows.length;
    
    for (let col = 1; col <= row.horizontalUnits; col++) {
      units.push({
        id: `W${row.rowNumber}.${col}`,
        row: row.rowNumber,
        column: col,
        openingType: defaultOpeningType,
        width: Math.round(unitWidth * 100) / 100,
        height: Math.round(unitHeight * 100) / 100,
      });
    }
  });
  
  return units;
}

// Helper to create default rows
export function createDefaultRows(verticalRows: number, totalHeight: number): WindowRow[] {
  const heightPerRow = totalHeight / verticalRows;
  return Array.from({ length: verticalRows }, (_, i) => ({
    rowNumber: i + 1,
    horizontalUnits: 1,
    height: heightPerRow,
  }));
}
