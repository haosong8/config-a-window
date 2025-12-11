export type ShapeType = 
  | "rectangle" 
  | "right-triangle" 
  | "trapezoid" 
  | "house" 
  | "parallelogram"
  | "hexagon"
  | "octagon"
  | "chamfered-rectangle";

export interface ShapeDimensions {
  // Rectangle
  width?: number;
  height?: number;
  // Right triangle
  baseWidth?: number;
  triangleHeight?: number;
  // Trapezoid (right trapezoid with left side vertical)
  bottomWidth?: number;
  topWidth?: number;
  trapezoidHeight?: number;
  // House shape (rectangle + gable)
  houseWidth?: number;
  wallHeight?: number;
  gableRise?: number;
  // Parallelogram
  parallelogramBase?: number;
  parallelogramHeight?: number;
  skewOffset?: number;
  // Hexagon (regular, flat top)
  flatToFlatHeight?: number;
  // Octagon (regular)
  octagonFlatToFlat?: number;
  // Chamfered rectangle
  chamferWidth?: number;
  chamferHeight?: number;
  chamfer?: number; // corner chamfer size (all 4 corners)
}

export interface Point {
  x: number;
  y: number;
}

// Shoelace formula for polygon area
export function polygonArea(points: Point[]): number {
  const n = points.length;
  let s = 0;
  for (let i = 0; i < n; i++) {
    const { x: x1, y: y1 } = points[i];
    const { x: x2, y: y2 } = points[(i + 1) % n];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}

// Get vertices for each shape type
export function getShapeVertices(shape: ShapeType, dims: ShapeDimensions): Point[] {
  switch (shape) {
    case "rectangle":
      return [
        { x: 0, y: 0 },
        { x: dims.width || 0, y: 0 },
        { x: dims.width || 0, y: dims.height || 0 },
        { x: 0, y: dims.height || 0 },
      ];

    case "right-triangle":
      return [
        { x: 0, y: 0 },
        { x: dims.baseWidth || 0, y: 0 },
        { x: 0, y: dims.triangleHeight || 0 },
      ];

    case "trapezoid": {
      const bottom = dims.bottomWidth || 0;
      const top = dims.topWidth || 0;
      const h = dims.trapezoidHeight || 0;
      return [
        { x: 0, y: 0 },
        { x: bottom, y: 0 },
        { x: top, y: h },
        { x: 0, y: h },
      ];
    }

    case "house": {
      const w = dims.houseWidth || 0;
      const wall = dims.wallHeight || 0;
      const gable = dims.gableRise || 0;
      return [
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: wall },
        { x: w / 2, y: wall + gable },
        { x: 0, y: wall },
      ];
    }

    case "parallelogram": {
      const base = dims.parallelogramBase || 0;
      const h = dims.parallelogramHeight || 0;
      const skew = dims.skewOffset || 0;
      return [
        { x: 0, y: 0 },
        { x: base, y: 0 },
        { x: base + skew, y: h },
        { x: skew, y: h },
      ];
    }

    case "hexagon": {
      // Regular hexagon (flat top/bottom)
      const D = dims.flatToFlatHeight || 0;
      const s = D / Math.sqrt(3); // side length
      const halfS = s / 2;
      const halfD = D / 2;
      // Centered at origin, then shift to positive quadrant
      return [
        { x: s + halfS, y: 0 },        // right bottom
        { x: s + s, y: halfD },        // right
        { x: s + halfS, y: D },        // right top
        { x: halfS, y: D },            // left top
        { x: 0, y: halfD },            // left
        { x: halfS, y: 0 },            // left bottom
      ];
    }

    case "octagon": {
      // Regular octagon from flat-to-flat distance
      const D = dims.octagonFlatToFlat || 0;
      const s = D / (1 + Math.sqrt(2)); // side length
      const offset = s / Math.sqrt(2); // diagonal offset
      return [
        { x: offset, y: 0 },
        { x: offset + s, y: 0 },
        { x: D, y: offset },
        { x: D, y: offset + s },
        { x: offset + s, y: D },
        { x: offset, y: D },
        { x: 0, y: offset + s },
        { x: 0, y: offset },
      ];
    }

    case "chamfered-rectangle": {
      // Rectangle with all 4 corners chamfered at 45°
      const w = dims.chamferWidth || 0;
      const h = dims.chamferHeight || 0;
      const c = dims.chamfer || 0;
      return [
        { x: c, y: 0 },           // bottom left after chamfer
        { x: w - c, y: 0 },       // bottom right before chamfer
        { x: w, y: c },           // right bottom after chamfer
        { x: w, y: h - c },       // right top before chamfer
        { x: w - c, y: h },       // top right after chamfer
        { x: c, y: h },           // top left before chamfer
        { x: 0, y: h - c },       // left top after chamfer
        { x: 0, y: c },           // left bottom before chamfer
      ];
    }

    default:
      return [];
  }
}

// Calculate area for a shape
export function calculateShapeArea(shape: ShapeType, dims: ShapeDimensions): number {
  const vertices = getShapeVertices(shape, dims);
  return polygonArea(vertices);
}

// Get bounding box for a shape
export function getShapeBoundingBox(vertices: Point[]): { width: number; height: number; minX: number; minY: number } {
  if (vertices.length === 0) return { width: 0, height: 0, minX: 0, minY: 0 };
  
  const xs = vertices.map(p => p.x);
  const ys = vertices.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    width: maxX - minX,
    height: maxY - minY,
    minX,
    minY,
  };
}
