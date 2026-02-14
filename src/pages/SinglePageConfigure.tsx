import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WindowConfig, createDefaultRows, generateWindowUnits } from "@/types/window-config";
import PriceCalculator from "@/components/configurator/PriceCalculator";
import ShapeSelector from "@/components/configurator/ShapeSelector";
import ShapePreview from "@/components/configurator/ShapePreview";
import ShapeDimensionInputs from "@/components/configurator/ShapeDimensionInputs";
import ProductTypeSelector from "@/components/configurator/ProductTypeSelector";
import DoorOptionsPanel from "@/components/configurator/DoorOptionsPanel";
import DoorPreview from "@/components/configurator/DoorPreview";
import { ShapeType, ShapeDimensions, calculateShapeArea } from "@/lib/geometry";

const SinglePageConfigure = () => {
  const [isIrregular, setIsIrregular] = useState(false);
  const [shape, setShape] = useState<ShapeType>("rectangle");
  const [dimensions, setDimensions] = useState<ShapeDimensions>({
    width: 48,
    height: 60,
    baseWidth: 48,
    triangleHeight: 36,
    bottomWidth: 60,
    topWidth: 36,
    trapezoidHeight: 48,
    houseWidth: 48,
    wallHeight: 36,
    gableRise: 24,
    parallelogramBase: 48,
    parallelogramHeight: 36,
    skewOffset: 12,
  });

  const initialWidth = 48;
  const initialHeight = 60;
  const initialRows = createDefaultRows(1, initialHeight);
  const initialUnits = generateWindowUnits(initialRows, initialWidth, initialHeight, "in-swing");

  const [config, setConfig] = useState<WindowConfig>({
    productType: "window",
    width: initialWidth,
    height: initialHeight,
    openingType: "in-swing",
    horizontalUnits: 1,
    verticalUnits: 1,
    verticalRows: 1,
    rows: initialRows,
    windowUnits: initialUnits,
    selectedWindowId: null,
    verticalPanes: 1,
    horizontalPanes: 1,
    glassType: "double-pane",
    thermalBreak: false,
    screens: false,
    color: "white",
    hardwareType: "standard",
    doorStyle: "single",
    liteType: "full-lite",
  });

  const updateDimensions = (updates: Partial<ShapeDimensions>) => {
    setDimensions(prev => ({ ...prev, ...updates }));
  };

  const updateConfig = (updates: Partial<WindowConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Calculate area based on shape
  const area = calculateShapeArea(shape, dimensions);
  const areaInSqFt = area / 144;

  // Create a modified config with the calculated area for pricing
  const configForPricing: WindowConfig = {
    ...config,
    // Use equivalent dimensions for pricing (area-based)
    width: Math.sqrt(area),
    height: Math.sqrt(area),
  };

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
        <h1 className="text-4xl font-bold mb-8 text-center">
          {config.productType === "door" ? "Door" : "Window"} Configurator
        </h1>

        {/* Product Type Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Type</CardTitle>
            <CardDescription>Choose what you're configuring</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductTypeSelector
              value={config.productType}
              onChange={(type) => updateConfig({ productType: type })}
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Left: Preview */}
          <Card className="lg:row-span-1">
            <CardHeader>
              <CardTitle className="text-2xl">
                Custom {config.productType === "door" ? "Door" : "Window"}
              </CardTitle>
              <CardDescription>Live preview of your configuration (to scale)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-8">
                {config.productType === "door" ? (
                  <DoorPreview
                    width={dimensions.width || 48}
                    height={dimensions.height || 80}
                    doorStyle={config.doorStyle}
                    liteType={config.liteType}
                    frameColor={config.color}
                  />
                ) : (
                  <ShapePreview shape={shape} dimensions={dimensions} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Right: Options */}
          <Card className="lg:row-span-1">
            <CardHeader>
              <CardTitle>Options & Attributes</CardTitle>
              <CardDescription>Customize your {config.productType} features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Door-specific options */}
              {config.productType === "door" && (
                <DoorOptionsPanel
                  doorStyle={config.doorStyle}
                  liteType={config.liteType}
                  onDoorStyleChange={(style) => updateConfig({ doorStyle: style })}
                  onLiteTypeChange={(lite) => updateConfig({ liteType: lite })}
                />
              )}
              {/* Opening Type - windows only */}
              {config.productType === "window" && (
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
              )}

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

          {/* Bottom Left: Shape & Dimensions Input */}
          <Card className="lg:row-span-1">
            <CardHeader>
              <CardTitle>Window Shape & Dimensions</CardTitle>
              <CardDescription>Select shape type and enter dimensions in inches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Regular/Irregular Toggle */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Shape Type</Label>
                <Tabs 
                  value={isIrregular ? "irregular" : "regular"} 
                  onValueChange={(v) => {
                    const irregular = v === "irregular";
                    setIsIrregular(irregular);
                    if (!irregular) setShape("rectangle");
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="regular">Regular</TabsTrigger>
                    <TabsTrigger value="irregular">Irregular</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Irregular Shape Selector - only show when irregular is selected */}
              {isIrregular && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Select Shape</Label>
                  <ShapeSelector value={shape} onChange={setShape} showRectangle={false} />
                </div>
              )}

              {/* Shape-specific dimension inputs */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Dimensions</Label>
                <ShapeDimensionInputs 
                  shape={shape}
                  dimensions={dimensions} 
                  updateDimensions={updateDimensions} 
                />
              </div>

              {/* Grid Configuration (only for rectangle windows) */}
              {config.productType === "window" && shape === "rectangle" && (
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
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Total Area: <span className="font-semibold text-foreground">
                    {areaInSqFt.toFixed(2)} sq ft
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
              <PriceCalculator config={configForPricing} detailed={true} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SinglePageConfigure;
