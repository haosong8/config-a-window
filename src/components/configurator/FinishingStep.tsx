import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WindowConfig, HardwareType } from "@/types/window-config";

interface FinishingStepProps {
  config: WindowConfig;
  updateConfig: (updates: Partial<WindowConfig>) => void;
}

const colors = [
  { value: "white", label: "White", hex: "#FFFFFF" },
  { value: "black", label: "Black", hex: "#1A1A1A" },
  { value: "bronze", label: "Bronze", hex: "#8B4513" },
  { value: "gray", label: "Gray", hex: "#6B7280" },
  { value: "beige", label: "Beige", hex: "#D4C4A8" },
  { value: "forest-green", label: "Forest Green", hex: "#228B22" },
];

const hardwareTypes: { value: HardwareType; label: string; description: string }[] = [
  { value: "standard", label: "Standard", description: "Durable and functional hardware" },
  { value: "premium", label: "Premium", description: "Enhanced aesthetics and smooth operation" },
  { value: "luxury", label: "Luxury", description: "Designer hardware with premium finish" },
];

const FinishingStep = ({ config, updateConfig }: FinishingStepProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Frame Color</CardTitle>
          <CardDescription>Choose the color finish for your window frame</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={config.color}
            onValueChange={(value) => updateConfig({ color: value })}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {colors.map((color) => (
              <div key={color.value}>
                <RadioGroupItem
                  value={color.value}
                  id={color.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={color.value}
                  className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-card p-4 hover:bg-surface-hover cursor-pointer peer-data-[state=checked]:border-accent-warm transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-sm font-medium">{color.label}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hardware Type</CardTitle>
          <CardDescription>Select the quality level of handles and locks</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={config.hardwareType}
            onValueChange={(value) => updateConfig({ hardwareType: value as HardwareType })}
            className="space-y-3"
          >
            {hardwareTypes.map((type) => (
              <div key={type.value}>
                <RadioGroupItem
                  value={type.value}
                  id={`hardware-${type.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`hardware-${type.value}`}
                  className="flex items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-surface-hover cursor-pointer peer-data-[state=checked]:border-accent-warm peer-data-[state=checked]:bg-accent-warm/5 transition-all"
                >
                  <div>
                    <p className="font-semibold">{type.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinishingStep;
