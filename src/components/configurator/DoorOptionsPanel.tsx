import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DoorStyle, LiteType } from "@/types/window-config";

interface DoorOptionsPanelProps {
  doorStyle: DoorStyle;
  liteType: LiteType;
  onDoorStyleChange: (style: DoorStyle) => void;
  onLiteTypeChange: (lite: LiteType) => void;
}

const doorStyles: { value: DoorStyle; label: string; description: string }[] = [
  { value: "single", label: "Single Door", description: "Standard single panel entry" },
  { value: "double", label: "Double Door", description: "Two-panel French door style" },
  { value: "sliding", label: "Sliding Door", description: "Horizontal sliding patio door" },
  { value: "bifold", label: "Bifold Door", description: "Folding multi-panel door" },
];

const liteTypes: { value: LiteType; label: string; description: string }[] = [
  { value: "full-lite", label: "Full Lite", description: "Full glass panel from top to bottom" },
  { value: "half-lite", label: "Half Lite", description: "Glass on top half, solid panel below" },
  { value: "solid", label: "Solid Panel", description: "No glass, fully solid door" },
];

const DoorOptionsPanel = ({ doorStyle, liteType, onDoorStyleChange, onLiteTypeChange }: DoorOptionsPanelProps) => {
  const showLiteOptions = doorStyle === "single" || doorStyle === "double";

  return (
    <div className="space-y-6">
      {/* Door Style */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Door Style</Label>
        <RadioGroup value={doorStyle} onValueChange={(v) => onDoorStyleChange(v as DoorStyle)}>
          <div className="grid grid-cols-2 gap-3">
            {doorStyles.map((ds) => (
              <div key={ds.value} className="flex items-start space-x-2 border rounded-lg p-3">
                <RadioGroupItem value={ds.value} id={`door-${ds.value}`} className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor={`door-${ds.value}`} className="cursor-pointer font-medium text-sm">
                    {ds.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{ds.description}</p>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Lite Type - only for single and double doors */}
      {showLiteOptions && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Glass Configuration</Label>
          <RadioGroup value={liteType} onValueChange={(v) => onLiteTypeChange(v as LiteType)}>
            <div className="grid grid-cols-3 gap-3">
              {liteTypes.map((lt) => (
                <div key={lt.value} className="flex flex-col items-center space-y-2 border rounded-lg p-3">
                  <RadioGroupItem value={lt.value} id={`lite-${lt.value}`} />
                  <Label htmlFor={`lite-${lt.value}`} className="cursor-pointer text-center">
                    <span className="font-medium text-sm block">{lt.label}</span>
                    <span className="text-xs text-muted-foreground">{lt.description}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default DoorOptionsPanel;
