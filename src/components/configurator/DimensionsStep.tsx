import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WindowConfig } from "@/types/window-config";

interface DimensionsStepProps {
  config: WindowConfig;
  updateConfig: (updates: Partial<WindowConfig>) => void;
}

const DimensionsStep = ({ config, updateConfig }: DimensionsStepProps) => {
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
              min="12"
              max="120"
              value={config.width}
              onChange={(e) => updateConfig({ width: parseInt(e.target.value) || 12 })}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">Range: 12" - 120"</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (inches)</Label>
            <Input
              id="height"
              type="number"
              min="12"
              max="120"
              value={config.height}
              onChange={(e) => updateConfig({ height: parseInt(e.target.value) || 12 })}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">Range: 12" - 120"</p>
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Preview Dimensions</p>
          <p className="text-3xl font-bold text-foreground">
            {config.width}" × {config.height}"
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            ({(config.width / 12).toFixed(1)}' × {(config.height / 12).toFixed(1)}')
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionsStep;
