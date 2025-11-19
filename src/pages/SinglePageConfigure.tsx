import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { WindowConfig } from "@/types/window-config";
import Window3D from "@/components/configurator/Window3D";
import PriceCalculator from "@/components/configurator/PriceCalculator";

const SinglePageConfigure = () => {
  const [config, setConfig] = useState<WindowConfig>({
    width: 48,
    height: 60,
    openingType: "in-swing",
    verticalPanes: 1,
    horizontalPanes: 1,
    glassType: "double-pane",
    thermalBreak: false,
    screens: false,
    color: "white",
    hardwareType: "standard"
  });

  const updateConfig = (updates: Partial<WindowConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Calculate scale for preview
  const maxPreviewSize = 400;
  const scale = Math.min(maxPreviewSize / config.width, maxPreviewSize / config.height);
  const previewWidth = config.width * scale;
  const previewHeight = config.height * scale;

  const colors = [
    { value: "white", label: "White", hex: "#FFFFFF" },
    { value: "black", label: "Black", hex: "#000000" },
    { value: "bronze", label: "Bronze", hex: "#8B4513" },
    { value: "champagne", label: "Champagne", hex: "#F7E7CE" }
  ];

  const hardwareTypes = [
    { value: "standard", label: "Standard", description: "Basic functional hardware" },
    { value: "premium", label: "Premium", description: "Enhanced durability and finish" }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Window Configurator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Left: Product Name & Window Preview */}
          <Card className="lg:row-span-1">
            <CardHeader>
              <CardTitle className="text-2xl">Custom Window</CardTitle>
              <CardDescription>Live preview of your configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-8">
                <div className="flex items-center justify-center min-h-[400px]">
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

                      {/* Grid overlay */}
                      <div className="absolute inset-0 grid" style={{
                        gridTemplateColumns: `repeat(${config.verticalPanes}, 1fr)`,
                        gridTemplateRows: `repeat(${config.horizontalPanes}, 1fr)`,
                        gap: '4px'
                      }}>
                        {Array.from({ length: config.verticalPanes * config.horizontalPanes }).map((_, i) => (
                          <div key={i} className="border border-primary/30" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Right: Options Attribute Selection */}
          <Card className="lg:row-span-1">
            <CardHeader>
              <CardTitle>Options & Attributes</CardTitle>
              <CardDescription>Customize your window features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Opening Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Opening Type</Label>
                <RadioGroup value={config.openingType} onValueChange={(value) => updateConfig({ openingType: value as any })}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "in-swing", label: "In-Swing" },
                      { value: "out-swing", label: "Out-Swing" },
                      { value: "double-hung", label: "Double Hung" },
                      { value: "single-hung", label: "Single Hung" }
                    ].map(option => (
                      <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer flex-1">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Glass Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Glass Type</Label>
                <RadioGroup value={config.glassType} onValueChange={(value) => updateConfig({ glassType: value as any })}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="double-pane" id="double-pane" />
                      <Label htmlFor="double-pane" className="cursor-pointer flex-1">Double Pane</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="triple-pane" id="triple-pane" />
                      <Label htmlFor="triple-pane" className="cursor-pointer flex-1">Triple Pane</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Frame Color */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Frame Color</Label>
                <RadioGroup value={config.color} onValueChange={(value) => updateConfig({ color: value })}>
                  <div className="grid grid-cols-2 gap-3">
                    {colors.map(color => (
                      <div key={color.value} className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value={color.value} id={`color-${color.value}`} />
                        <div 
                          className="w-6 h-6 rounded border-2 border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <Label htmlFor={`color-${color.value}`} className="cursor-pointer flex-1">{color.label}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Hardware */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Hardware Type</Label>
                <RadioGroup value={config.hardwareType} onValueChange={(value) => updateConfig({ hardwareType: value as any })}>
                  <div className="space-y-2">
                    {hardwareTypes.map(hw => (
                      <div key={hw.value} className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value={hw.value} id={`hw-${hw.value}`} />
                        <div className="flex-1">
                          <Label htmlFor={`hw-${hw.value}`} className="cursor-pointer font-medium">{hw.label}</Label>
                          <p className="text-xs text-muted-foreground">{hw.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Additional Features */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Additional Features</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <Label htmlFor="thermal-break" className="font-medium">Thermal Break</Label>
                      <p className="text-xs text-muted-foreground">Enhanced insulation</p>
                    </div>
                    <Switch 
                      id="thermal-break"
                      checked={config.thermalBreak}
                      onCheckedChange={(checked) => updateConfig({ thermalBreak: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <Label htmlFor="screens" className="font-medium">Screens</Label>
                      <p className="text-xs text-muted-foreground">Insect protection</p>
                    </div>
                    <Switch 
                      id="screens"
                      checked={config.screens}
                      onCheckedChange={(checked) => updateConfig({ screens: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Left: Window Dimensions Input */}
          <Card className="lg:row-span-1">
            <CardHeader>
              <CardTitle>Window Dimensions</CardTitle>
              <CardDescription>Enter width and height in inches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-sm text-destructive">⚠️ Range: 12" - 120"</p>
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
                    <p className="text-sm text-destructive">⚠️ Range: 12" - 120"</p>
                  )}
                </div>
              </div>

              {/* Grid Configuration */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Grid Pattern</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vertical-panes">Vertical Panes</Label>
                    <Input
                      id="vertical-panes"
                      type="number"
                      min="1"
                      max="3"
                      value={config.verticalPanes}
                      onChange={(e) => updateConfig({ verticalPanes: Math.max(1, Math.min(3, parseInt(e.target.value) || 1)) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horizontal-panes">Horizontal Panes</Label>
                    <Input
                      id="horizontal-panes"
                      type="number"
                      min="1"
                      max="3"
                      value={config.horizontalPanes}
                      onChange={(e) => updateConfig({ horizontalPanes: Math.max(1, Math.min(3, parseInt(e.target.value) || 1)) })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Total Area: <span className="font-semibold text-foreground">
                    {((config.width * config.height) / 144).toFixed(2)} sq ft
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Right: Product Pricing */}
          <Card className="lg:row-span-1">
            <CardHeader>
              <CardTitle>Product Pricing</CardTitle>
              <CardDescription>Estimated cost breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <PriceCalculator config={config} detailed={true} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SinglePageConfigure;
