import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShapeType } from "@/lib/geometry";
import { Square, Triangle, Home, Hexagon } from "lucide-react";

interface ShapeSelectorProps {
  value: ShapeType;
  onChange: (shape: ShapeType) => void;
}

const shapes: { value: ShapeType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "rectangle",
    label: "Rectangle",
    description: "Standard 4-sided",
    icon: <Square className="w-6 h-6" />,
  },
  {
    value: "right-triangle",
    label: "Triangle",
    description: "3-sided rake",
    icon: <Triangle className="w-6 h-6" />,
  },
  {
    value: "trapezoid",
    label: "Trapezoid",
    description: "4-sided rake",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 18 L20 18 L16 6 L4 6 Z" />
      </svg>
    ),
  },
  {
    value: "house",
    label: "House Shape",
    description: "5-sided gable",
    icon: <Home className="w-6 h-6" />,
  },
  {
    value: "parallelogram",
    label: "Parallelogram",
    description: "Slanted rectangle",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 18 L18 18 L22 6 L10 6 Z" />
      </svg>
    ),
  },
];

const ShapeSelector = ({ value, onChange }: ShapeSelectorProps) => {
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as ShapeType)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {shapes.map((shape) => (
          <div
            key={shape.value}
            className={`relative border rounded-lg p-3 cursor-pointer transition-all hover:border-primary ${
              value === shape.value ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''
            }`}
            onClick={() => onChange(shape.value)}
          >
            <RadioGroupItem value={shape.value} id={`shape-${shape.value}`} className="sr-only" />
            <div className="flex flex-col items-center text-center gap-2">
              <div className="text-primary">{shape.icon}</div>
              <div>
                <Label htmlFor={`shape-${shape.value}`} className="cursor-pointer font-medium text-sm">
                  {shape.label}
                </Label>
                <p className="text-xs text-muted-foreground">{shape.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};

export default ShapeSelector;
