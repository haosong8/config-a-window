import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { WindowConfig } from "@/types/window-config";
import WindowGridConfigurator from "./WindowGridConfigurator";

interface StyleStepProps {
  config: WindowConfig;
  updateConfig: (updates: Partial<WindowConfig>) => void;
}

const StyleStep = ({ config, updateConfig }: StyleStepProps) => {
  return (
    <div className="space-y-6">
      {/* Window Grid Configuration */}
      <WindowGridConfigurator config={config} updateConfig={updateConfig} />

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
