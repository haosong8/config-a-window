import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShapeType, ShapeDimensions } from "@/lib/geometry";

interface ShapeDimensionInputsProps {
  shape: ShapeType;
  dimensions: ShapeDimensions;
  updateDimensions: (updates: Partial<ShapeDimensions>) => void;
}

const ShapeDimensionInputs = ({ shape, dimensions, updateDimensions }: ShapeDimensionInputsProps) => {
  const renderInputs = () => {
    switch (shape) {
      case "rectangle":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (inches)</Label>
              <Input
                id="width"
                type="number"
                value={dimensions.width === 0 ? '' : dimensions.width || ''}
                onChange={(e) => updateDimensions({ width: parseInt(e.target.value) || 0 })}
                className="text-lg"
              />
              {((dimensions.width || 0) < 12 || (dimensions.width || 0) > 120) && (
                <p className="text-sm text-destructive">⚠️ Range: 12" - 120"</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                value={dimensions.height === 0 ? '' : dimensions.height || ''}
                onChange={(e) => updateDimensions({ height: parseInt(e.target.value) || 0 })}
                className="text-lg"
              />
              {((dimensions.height || 0) < 12 || (dimensions.height || 0) > 120) && (
                <p className="text-sm text-destructive">⚠️ Range: 12" - 120"</p>
              )}
            </div>
          </div>
        );

      case "right-triangle":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseWidth">Base Width (inches)</Label>
              <Input
                id="baseWidth"
                type="number"
                value={dimensions.baseWidth === 0 ? '' : dimensions.baseWidth || ''}
                onChange={(e) => updateDimensions({ baseWidth: parseInt(e.target.value) || 0 })}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Horizontal bottom edge</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triangleHeight">Height (inches)</Label>
              <Input
                id="triangleHeight"
                type="number"
                value={dimensions.triangleHeight === 0 ? '' : dimensions.triangleHeight || ''}
                onChange={(e) => updateDimensions({ triangleHeight: parseInt(e.target.value) || 0 })}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Vertical left edge</p>
            </div>
          </div>
        );

      case "trapezoid":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bottomWidth">Bottom Width (inches)</Label>
                <Input
                  id="bottomWidth"
                  type="number"
                  value={dimensions.bottomWidth === 0 ? '' : dimensions.bottomWidth || ''}
                  onChange={(e) => updateDimensions({ bottomWidth: parseInt(e.target.value) || 0 })}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topWidth">Top Width (inches)</Label>
                <Input
                  id="topWidth"
                  type="number"
                  value={dimensions.topWidth === 0 ? '' : dimensions.topWidth || ''}
                  onChange={(e) => updateDimensions({ topWidth: parseInt(e.target.value) || 0 })}
                  className="text-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trapezoidHeight">Height (inches)</Label>
              <Input
                id="trapezoidHeight"
                type="number"
                value={dimensions.trapezoidHeight === 0 ? '' : dimensions.trapezoidHeight || ''}
                onChange={(e) => updateDimensions({ trapezoidHeight: parseInt(e.target.value) || 0 })}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Left side is vertical (90°)</p>
            </div>
            {(dimensions.bottomWidth || 0) < (dimensions.topWidth || 0) && (
              <p className="text-sm text-destructive">⚠️ Bottom width must be ≥ top width</p>
            )}
          </div>
        );

      case "house":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="houseWidth">Width (inches)</Label>
              <Input
                id="houseWidth"
                type="number"
                value={dimensions.houseWidth === 0 ? '' : dimensions.houseWidth || ''}
                onChange={(e) => updateDimensions({ houseWidth: parseInt(e.target.value) || 0 })}
                className="text-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wallHeight">Wall Height (inches)</Label>
                <Input
                  id="wallHeight"
                  type="number"
                  value={dimensions.wallHeight === 0 ? '' : dimensions.wallHeight || ''}
                  onChange={(e) => updateDimensions({ wallHeight: parseInt(e.target.value) || 0 })}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">Rectangular portion</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gableRise">Gable Rise (inches)</Label>
                <Input
                  id="gableRise"
                  type="number"
                  value={dimensions.gableRise === 0 ? '' : dimensions.gableRise || ''}
                  onChange={(e) => updateDimensions({ gableRise: parseInt(e.target.value) || 0 })}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">Peak height above wall</p>
              </div>
            </div>
          </div>
        );

      case "parallelogram":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parallelogramBase">Base Width (inches)</Label>
                <Input
                  id="parallelogramBase"
                  type="number"
                  value={dimensions.parallelogramBase === 0 ? '' : dimensions.parallelogramBase || ''}
                  onChange={(e) => updateDimensions({ parallelogramBase: parseInt(e.target.value) || 0 })}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parallelogramHeight">Height (inches)</Label>
                <Input
                  id="parallelogramHeight"
                  type="number"
                  value={dimensions.parallelogramHeight === 0 ? '' : dimensions.parallelogramHeight || ''}
                  onChange={(e) => updateDimensions({ parallelogramHeight: parseInt(e.target.value) || 0 })}
                  className="text-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skewOffset">Skew Offset (inches)</Label>
              <Input
                id="skewOffset"
                type="number"
                value={dimensions.skewOffset === 0 ? '' : dimensions.skewOffset || ''}
                onChange={(e) => updateDimensions({ skewOffset: parseInt(e.target.value) || 0 })}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Horizontal shift of top edge (can be negative)</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="space-y-4">{renderInputs()}</div>;
};

export default ShapeDimensionInputs;
