import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { WindowConfig, OpeningType } from "@/types/window-config";
import Window3D from "./Window3D";
import { Grid3X3, Columns, Rows } from "lucide-react";

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
  return <Window3D type={type} />;
};

const StyleStep = ({ config, updateConfig }: StyleStepProps) => {
  return (
    <div className="space-y-6">
      {/* Window Units Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Window Units in Opening
          </CardTitle>
          <CardDescription>
            Configure how many individual windows fit in your opening (mulled configuration)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="horizontalUnits" className="flex items-center gap-2">
                <Columns className="w-4 h-4" />
                Horizontal (Side by Side)
              </Label>
              <Input
                id="horizontalUnits"
                type="number"
                min={1}
                max={6}
                value={config.horizontalUnits === 0 ? '' : config.horizontalUnits}
                onChange={(e) =>
                  updateConfig({ horizontalUnits: Math.max(1, Math.min(6, parseInt(e.target.value) || 1)) })
                }
              />
              <p className="text-xs text-muted-foreground">Number of windows placed horizontally (1-6)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verticalUnits" className="flex items-center gap-2">
                <Rows className="w-4 h-4" />
                Vertical (Stacked)
              </Label>
              <Input
                id="verticalUnits"
                type="number"
                min={1}
                max={4}
                value={config.verticalUnits === 0 ? '' : config.verticalUnits}
                onChange={(e) =>
                  updateConfig({ verticalUnits: Math.max(1, Math.min(4, parseInt(e.target.value) || 1)) })
                }
              />
              <p className="text-xs text-muted-foreground">Number of windows stacked vertically (1-4)</p>
            </div>
          </div>

          {/* Visual Preview of Window Units */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">Opening Layout Preview</p>
            <div className="flex justify-center">
              <div 
                className="inline-grid gap-2 p-4 bg-background rounded border-2 border-primary/30"
                style={{
                  gridTemplateColumns: `repeat(${config.horizontalUnits}, 1fr)`,
                  gridTemplateRows: `repeat(${config.verticalUnits}, 1fr)`,
                }}
              >
                {Array.from({ length: config.horizontalUnits * config.verticalUnits }).map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-20 bg-blue-100 border-2 border-primary/40 rounded flex items-center justify-center text-xs font-medium text-primary/60"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Total: {config.horizontalUnits * config.verticalUnits} window unit{config.horizontalUnits * config.verticalUnits > 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Opening Type */}
      <Card>
        <CardHeader>
          <CardTitle>Opening Type</CardTitle>
          <CardDescription>Choose how each window unit opens</CardDescription>
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

      {/* Grid Pattern (panes within each window) */}
      <Card>
        <CardHeader>
          <CardTitle>Grid Pattern (Per Window)</CardTitle>
          <CardDescription>Configure the pane divisions within each window unit</CardDescription>
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
            <p className="text-sm text-muted-foreground mb-2">Single Window Pane Preview</p>
            <div className="inline-flex gap-1 p-4 bg-background rounded border-2 border-primary/20">
              {Array.from({ length: config.horizontalPanes }).map((_, h) => (
                <div key={h} className="flex flex-col gap-1">
                  {Array.from({ length: config.verticalPanes }).map((_, v) => (
                    <div
                      key={v}
                      className="w-12 h-12 bg-blue-100 border-2 border-primary/30 rounded"
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
