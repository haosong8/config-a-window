import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WindowConfig } from "@/types/window-config";
import { Check } from "lucide-react";

interface ReviewStepProps {
  config: WindowConfig;
  updateConfig: (updates: Partial<WindowConfig>) => void;
}

const ReviewStep = ({ config }: ReviewStepProps) => {
  const formatOpeningType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatColor = (color: string) => {
    return color
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-accent-warm/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-accent-warm" />
            </div>
            <div>
              <CardTitle>Configuration Summary</CardTitle>
              <CardDescription>Review your custom window specifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Dimensions</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Width</p>
                <p className="text-lg font-semibold">{config.width}"</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-lg font-semibold">{config.height}"</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Style & Configuration</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Opening Type</span>
                <Badge variant="secondary">{formatOpeningType(config.openingType)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Grid Pattern</span>
                <Badge variant="secondary">
                  {config.horizontalPanes} × {config.verticalPanes}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Glass & Features</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Glass Type</span>
                <Badge variant="secondary">
                  {config.glassType === "double-pane" ? "Double Pane" : "Triple Pane"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Thermal Break</span>
                <Badge variant={config.thermalBreak ? "default" : "outline"}>
                  {config.thermalBreak ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Screens</span>
                <Badge variant={config.screens ? "default" : "outline"}>
                  {config.screens ? "Included" : "Not Included"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Finishing</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Color</span>
                <Badge variant="secondary">{formatColor(config.color)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Hardware</span>
                <Badge variant="secondary">
                  {config.hardwareType.charAt(0).toUpperCase() + config.hardwareType.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent-warm/20 bg-accent-warm/5">
        <CardHeader>
          <CardTitle className="text-lg">Ready to Order?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your custom window configuration is complete. Contact our sales team to finalize your order and
            receive a detailed quote. Our experts will work with you to ensure every detail meets your
            specifications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
