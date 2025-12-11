import { ShapeType, ShapeDimensions, getShapeVertices, getShapeBoundingBox, calculateShapeArea } from "@/lib/geometry";

interface ShapePreviewProps {
  shape: ShapeType;
  dimensions: ShapeDimensions;
  maxSize?: number;
}

const ShapePreview = ({ shape, dimensions, maxSize = 350 }: ShapePreviewProps) => {
  const vertices = getShapeVertices(shape, dimensions);
  const bbox = getShapeBoundingBox(vertices);
  const area = calculateShapeArea(shape, dimensions);
  
  if (bbox.width === 0 || bbox.height === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Enter dimensions to see preview
      </div>
    );
  }
  
  // Calculate scale to fit in container
  const scale = Math.min(maxSize / bbox.width, maxSize / bbox.height);
  const scaledWidth = bbox.width * scale;
  const scaledHeight = bbox.height * scale;
  
  // Create SVG path from vertices
  const pathData = vertices
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p.x - bbox.minX) * scale} ${scaledHeight - (p.y - bbox.minY) * scale}`)
    .join(' ') + ' Z';
  
  // Calculate dimension label positions
  const getDimensionLabels = () => {
    switch (shape) {
      case "rectangle":
        return (
          <>
            {/* Width label (top) */}
            <div className="absolute -top-8 left-0 right-0 flex justify-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                {dimensions.width}" ({((dimensions.width || 0) / 12).toFixed(1)}')
              </div>
            </div>
            {/* Height label (right) */}
            <div className="absolute -right-24 top-0 bottom-0 flex items-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                {dimensions.height}" ({((dimensions.height || 0) / 12).toFixed(1)}')
              </div>
            </div>
          </>
        );
      
      case "right-triangle":
        return (
          <>
            {/* Base label (bottom) */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                Base: {dimensions.baseWidth}"
              </div>
            </div>
            {/* Height label (left) */}
            <div className="absolute -left-24 top-0 bottom-0 flex items-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                Height: {dimensions.triangleHeight}"
              </div>
            </div>
          </>
        );
      
      case "trapezoid":
        return (
          <>
            {/* Bottom width label */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                Bottom: {dimensions.bottomWidth}"
              </div>
            </div>
            {/* Top width label */}
            <div className="absolute -top-8 left-0 flex justify-start">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                Top: {dimensions.topWidth}"
              </div>
            </div>
            {/* Height label (left) */}
            <div className="absolute -left-20 top-0 bottom-0 flex items-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                H: {dimensions.trapezoidHeight}"
              </div>
            </div>
          </>
        );
      
      case "house":
        return (
          <>
            {/* Width label (bottom) */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                Width: {dimensions.houseWidth}"
              </div>
            </div>
            {/* Wall height label (right) */}
            <div className="absolute -right-24 bottom-0 flex items-end" style={{ height: `${(dimensions.wallHeight || 0) / bbox.height * 100}%` }}>
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                Wall: {dimensions.wallHeight}"
              </div>
            </div>
            {/* Gable rise label (top) */}
            <div className="absolute -top-8 left-0 right-0 flex justify-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                Gable: {dimensions.gableRise}"
              </div>
            </div>
          </>
        );
      
      case "parallelogram":
        return (
          <>
            {/* Base label (bottom) */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                Base: {dimensions.parallelogramBase}"
              </div>
            </div>
            {/* Height label */}
            <div className="absolute -right-20 top-0 bottom-0 flex items-center">
              <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
                H: {dimensions.parallelogramHeight}"
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative" style={{ width: scaledWidth, height: scaledHeight }}>
        <svg
          width={scaledWidth}
          height={scaledHeight}
          className="overflow-visible"
        >
          <path
            d={pathData}
            fill="hsl(var(--primary) / 0.1)"
            stroke="hsl(var(--primary))"
            strokeWidth={4}
          />
        </svg>
        {getDimensionLabels()}
      </div>
      <div className="mt-12 text-sm text-muted-foreground">
        Area: <span className="font-semibold text-foreground">{(area / 144).toFixed(2)} sq ft</span>
      </div>
    </div>
  );
};

export default ShapePreview;
