import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WindowConfig } from "@/types/window-config";

interface DimensionsStepProps {
  config: WindowConfig;
  updateConfig: (updates: Partial<WindowConfig>) => void;
}

const DimensionsStep = ({ config, updateConfig }: DimensionsStepProps) => {
  // Calculate scale for preview (max 400px container)
  const maxPreviewSize = 400;
  const scale = Math.min(maxPreviewSize / config.width, maxPreviewSize / config.height);
  const previewWidth = config.width * scale;
  const previewHeight = config.height * scale;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Window Dimensions</CardTitle>
        <CardDescription>Specify the width and height of your custom window</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="width">Width (inches)</Label>
            <Input
              id="width"
              type="number"
              value={config.width === 0 ? '' : config.width}
              onChange={(e) => updateConfig({ width: parseInt(e.target.value) || 0 })}
              className="text-lg"
            />
            {(config.width < 12 || config.width > 120) && (
              <p className="text-sm text-destructive">⚠️ Recommended range: 12" - 120"</p>
            )}
            {config.width >= 12 && config.width <= 120 && (
              <p className="text-sm text-muted-foreground">Recommended range: 12" - 120"</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (inches)</Label>
            <Input
              id="height"
              type="number"
              value={config.height === 0 ? '' : config.height}
              onChange={(e) => updateConfig({ height: parseInt(e.target.value) || 0 })}
              className="text-lg"
            />
            {(config.height < 12 || config.height > 120) && (
              <p className="text-sm text-destructive">⚠️ Recommended range: 12" - 120"</p>
            )}
            {config.height >= 12 && config.height <= 120 && (
              <p className="text-sm text-muted-foreground">Recommended range: 12" - 120"</p>
            )}
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-8">
          <p className="text-sm text-muted-foreground mb-4 text-center">Visual Preview (to scale)</p>
          <div className="flex items-center justify-center min-h-[420px]">
            <div className="relative">
              <div 
                className="border-4 border-primary bg-primary/5 relative transition-all duration-300"
                style={{
                  width: `${previewWidth}px`,
                  height: `${previewHeight}px`
                }}
              >
                {/* Width dimension label */}
                <div className="absolute -top-8 left-0 right-0 flex items-center justify-center">
                  <div className="bg-background border border-border px-3 py-1 rounded-md text-sm font-medium">
                    {config.width}" ({(config.width / 12).toFixed(1)}')
                  </div>
                </div>
                
                {/* Height dimension label */}
                <div className="absolute -right-24 top-0 bottom-0 flex items-center justify-center">
                  <div className="bg-background border border-border px-3 py-1 rounded-md text-sm font-medium">
                    {config.height}" ({(config.height / 12).toFixed(1)}')
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionsStep;
