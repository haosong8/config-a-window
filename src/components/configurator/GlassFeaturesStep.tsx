import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { WindowConfig, GlassType } from "@/types/window-config";

interface GlassFeaturesStepProps {
  config: WindowConfig;
  updateConfig: (updates: Partial<WindowConfig>) => void;
}

const glassTypes: { value: GlassType; label: string; description: string }[] = [
  { value: "double-pane", label: "Double Pane", description: "Good insulation and energy efficiency" },
  { value: "triple-pane", label: "Triple Pane", description: "Superior insulation and soundproofing" },
];

const GlassFeaturesStep = ({ config, updateConfig }: GlassFeaturesStepProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Glass Type</CardTitle>
          <CardDescription>Select the glass pane configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={config.glassType}
            onValueChange={(value) => updateConfig({ glassType: value as GlassType })}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {glassTypes.map((type) => (
              <div key={type.value}>
                <RadioGroupItem
                  value={type.value}
                  id={type.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={type.value}
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-surface-hover cursor-pointer peer-data-[state=checked]:border-accent-warm peer-data-[state=checked]:bg-accent-warm/5 transition-all"
                >
                  <div className="text-center">
                    <p className="font-semibold">{type.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Features</CardTitle>
          <CardDescription>Enhance your window with optional features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-0.5">
              <Label htmlFor="thermal-break" className="text-base font-semibold">
                Thermal Break
              </Label>
              <p className="text-sm text-muted-foreground">
                Reduces heat transfer for better energy efficiency
              </p>
            </div>
            <Switch
              id="thermal-break"
              checked={config.thermalBreak}
              onCheckedChange={(checked) => updateConfig({ thermalBreak: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-0.5">
              <Label htmlFor="screens" className="text-base font-semibold">
                Screens
              </Label>
              <p className="text-sm text-muted-foreground">
                Include removable insect screens
              </p>
            </div>
            <Switch
              id="screens"
              checked={config.screens}
              onCheckedChange={(checked) => updateConfig({ screens: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlassFeaturesStep;
