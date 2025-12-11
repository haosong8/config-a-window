export type ShapeType = "rectangle" | "right-triangle" | "trapezoid" | "house" | "parallelogram";

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
