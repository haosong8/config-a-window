import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import DimensionsStep from "@/components/configurator/DimensionsStep";
import StyleStep from "@/components/configurator/StyleStep";
import GlassFeaturesStep from "@/components/configurator/GlassFeaturesStep";
import FinishingStep from "@/components/configurator/FinishingStep";
import ReviewStep from "@/components/configurator/ReviewStep";
import PriceCalculator from "@/components/configurator/PriceCalculator";
import ProductTypeSelector from "@/components/configurator/ProductTypeSelector";
import DoorOptionsPanel from "@/components/configurator/DoorOptionsPanel";
import DoorPreview from "@/components/configurator/DoorPreview";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WindowConfig, ProductType, createDefaultRows, generateWindowUnits } from "@/types/window-config";

const steps = [
  { id: 1, name: "Product Type", component: null },
  { id: 2, name: "Dimensions", component: DimensionsStep },
  { id: 3, name: "Style", component: StyleStep },
  { id: 4, name: "Glass & Features", component: GlassFeaturesStep },
  { id: 5, name: "Finishing", component: FinishingStep },
  { id: 6, name: "Review", component: ReviewStep },
];

const Configure = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const initialWidth = 36;
  const initialHeight = 48;
  const initialRows = createDefaultRows(1, initialHeight);
  const initialUnits = generateWindowUnits(initialRows, initialWidth, initialHeight, "double-hung");
  
  const [config, setConfig] = useState<WindowConfig>({
    productType: "window",
    width: initialWidth,
    height: initialHeight,
    openingType: "double-hung",
    thermalBreak: false,
    color: "white",
    horizontalUnits: 1,
    verticalUnits: 1,
    verticalRows: 1,
    rows: initialRows,
    windowUnits: initialUnits,
    selectedWindowId: null,
    verticalPanes: 1,
    horizontalPanes: 1,
    glassType: "double-pane",
    screens: false,
    hardwareType: "standard",
    doorStyle: "single",
    liteType: "full-lite",
    doorPanels: 2,
  });

  const progress = (currentStep / steps.length) * 100;

  // Get active steps based on product type
  const getActiveSteps = () => {
    if (config.productType === "door") {
      // Doors skip the Style step (no grid configurator needed)
      return steps.filter(s => s.id !== 3);
    }
    return steps;
  };
  const activeSteps = getActiveSteps();
  const activeIndex = activeSteps.findIndex(s => s.id === currentStep);

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return true; // Product type always valid
      case 2: // Dimensions
        return config.width >= 12 && config.width <= 120 && config.height >= 12 && config.height <= 120;
      case 3: // Style (windows only)
        return config.verticalPanes >= 1 && config.verticalPanes <= 3 && 
               config.horizontalPanes >= 1 && config.horizontalPanes <= 3;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (activeIndex < activeSteps.length - 1 && isStepValid()) {
      const nextStep = activeSteps[activeIndex + 1];
      setCurrentStep(nextStep.id);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      const prevStep = activeSteps[activeIndex - 1];
      setCurrentStep(prevStep.id);
    } else {
      navigate("/");
    }
  };

  const updateConfig = (updates: Partial<WindowConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const isLastStep = activeIndex === activeSteps.length - 1;

  // Render step content
  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>What are you configuring?</CardTitle>
            <CardDescription>Select the product type to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProductTypeSelector
              value={config.productType}
              onChange={(type) => updateConfig({ productType: type })}
            />
            {config.productType === "door" && (
              <div className="pt-4 border-t">
                <DoorOptionsPanel
                  doorStyle={config.doorStyle}
                  liteType={config.liteType}
                  doorPanels={config.doorPanels}
                  onDoorStyleChange={(style) => updateConfig({ doorStyle: style })}
                  onLiteTypeChange={(lite) => updateConfig({ liteType: lite })}
                  onDoorPanelsChange={(panels) => updateConfig({ doorPanels: panels })}
                />
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    // For door product, show door preview alongside dimension step
    if (currentStep === 2 && config.productType === "door") {
      return (
        <div className="space-y-6">
          <DimensionsStep config={config} updateConfig={updateConfig} />
          <Card>
            <CardHeader>
              <CardTitle>Door Preview</CardTitle>
              <CardDescription>Visual preview of your door configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-8">
                <DoorPreview
                  width={config.width}
                  height={config.height}
                  doorStyle={config.doorStyle}
                  liteType={config.liteType}
                  doorPanels={config.doorPanels}
                  frameColor={config.color}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const currentStepDef = steps.find(s => s.id === currentStep);
    const StepComponent = currentStepDef?.component;
    if (StepComponent) {
      return <StepComponent config={config} updateConfig={updateConfig} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              {config.productType === "door" ? "Door" : "Window"} Configurator
            </h1>
            <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">
              Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {activeSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    activeIndex > index
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "border-accent-warm text-accent-warm bg-accent-warm/10"
                      : "border-border text-muted-foreground bg-background"
                  }`}
                >
                  {activeIndex > index ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < activeSteps.length - 1 && (
                  <div
                    className={`h-0.5 w-12 md:w-24 mx-2 transition-all ${
                      activeIndex > index ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={((activeIndex + 1) / activeSteps.length) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {activeIndex + 1} of {activeSteps.length}: {activeSteps[activeIndex]?.name}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
          
          {!isLastStep && (
            <div className="mt-6">
              <PriceCalculator config={config} detailed={false} />
            </div>
          )}

          <div className="flex justify-between mt-8 pt-8 border-t">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={isLastStep || !isStepValid()}>
              {isLastStep ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configure;
