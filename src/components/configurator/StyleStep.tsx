import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { WindowConfig, OpeningType } from "@/types/window-config";

interface StyleStepProps {
  config: WindowConfig;
  updateConfig: (updates: Partial<WindowConfig>) => void;
}

const openingTypes: { value: OpeningType; label: string; description: string }[] = [
  { value: "double-hung", label: "Double Hung", description: "Both sashes slide vertically" },
  { value: "single-hung", label: "Single Hung", description: "Only bottom sash slides" },
  { value: "in-swing", label: "In-Swing", description: "Opens inward" },
  { value: "out-swing", label: "Out-Swing", description: "Opens outward" },
];

const OpeningVisual = ({ type }: { type: OpeningType }) => {
  const baseClasses = "border-2 border-primary/40 bg-blue-50";
  
  switch (type) {
    case "double-hung":
      return (
        <div className="flex flex-col gap-0.5 w-20 h-24 mx-auto mb-3">
          <div className={`${baseClasses} h-1/2 flex items-center justify-center relative`}>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary/60 rounded"></div>
            <div className="text-[10px] text-primary/60">↕</div>
          </div>
          <div className={`${baseClasses} h-1/2 flex items-center justify-center relative`}>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary/60 rounded"></div>
            <div className="text-[10px] text-primary/60">↕</div>
          </div>
        </div>
      );
    case "single-hung":
      return (
        <div className="flex flex-col gap-0.5 w-20 h-24 mx-auto mb-3">
          <div className={`${baseClasses} h-1/2 flex items-center justify-center`}>
            <div className="text-[10px] text-muted-foreground">Fixed</div>
          </div>
          <div className={`${baseClasses} h-1/2 flex items-center justify-center relative`}>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary/60 rounded"></div>
            <div className="text-[10px] text-primary/60">↕</div>
          </div>
        </div>
      );
    case "in-swing":
      return (
        <div className="w-20 h-24 mx-auto mb-3 relative">
          <div className={`${baseClasses} w-full h-full relative overflow-hidden`}>
            <div className="absolute left-0 top-0 w-1 h-full bg-primary/60"></div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-8 border-2 border-primary/60 rounded-full bg-primary/20"></div>
            <div className="text-[10px] text-primary/60 absolute right-3 top-1/2 -translate-y-1/2">→</div>
          </div>
        </div>
      );
    case "out-swing":
      return (
        <div className="w-20 h-24 mx-auto mb-3 relative">
          <div className={`${baseClasses} w-full h-full relative overflow-hidden`}>
            <div className="absolute left-0 top-0 w-1 h-full bg-primary/60"></div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-8 border-2 border-primary/60 rounded-full bg-primary/20"></div>
            <div className="text-[10px] text-primary/60 absolute left-3 top-1/2 -translate-y-1/2">←</div>
          </div>
        </div>
      );
  }
};

const StyleStep = ({ config, updateConfig }: StyleStepProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Opening Type</CardTitle>
          <CardDescription>Choose how your window opens</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={config.openingType}
            onValueChange={(value) => updateConfig({ openingType: value as OpeningType })}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {openingTypes.map((type) => (
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
                  <OpeningVisual type={type.value} />
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
          <CardTitle>Grid Pattern</CardTitle>
          <CardDescription>Configure the number of window panes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vertical">Vertical Panes</Label>
              <Input
                id="vertical"
                type="number"
                value={config.verticalPanes === 0 ? '' : config.verticalPanes}
                onChange={(e) =>
                  updateConfig({ verticalPanes: parseInt(e.target.value) || 0 })
                }
              />
              {(config.verticalPanes < 1 || config.verticalPanes > 3) && (
                <p className="text-sm text-destructive">⚠️ Required range: 1-3 panes</p>
              )}
              {config.verticalPanes >= 1 && config.verticalPanes <= 3 && (
                <p className="text-sm text-muted-foreground">Required range: 1-3 panes</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="horizontal">Horizontal Panes</Label>
              <Input
                id="horizontal"
                type="number"
                value={config.horizontalPanes === 0 ? '' : config.horizontalPanes}
                onChange={(e) =>
                  updateConfig({ horizontalPanes: parseInt(e.target.value) || 0 })
                }
              />
              {(config.horizontalPanes < 1 || config.horizontalPanes > 3) && (
                <p className="text-sm text-destructive">⚠️ Required range: 1-3 panes</p>
              )}
              {config.horizontalPanes >= 1 && config.horizontalPanes <= 3 && (
                <p className="text-sm text-muted-foreground">Required range: 1-3 panes</p>
              )}
            </div>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Grid Preview</p>
            <div className="inline-flex gap-1 p-4 bg-background rounded border-2 border-primary/20">
              {Array.from({ length: config.horizontalPanes }).map((_, h) => (
                <div key={h} className="flex flex-col gap-1">
                  {Array.from({ length: config.verticalPanes }).map((_, v) => (
                    <div
                      key={v}
                      className="w-16 h-16 bg-blue-100 border-2 border-primary/30 rounded"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleStep;
