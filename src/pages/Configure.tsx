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
import { WindowConfig } from "@/types/window-config";

const steps = [
  { id: 1, name: "Dimensions", component: DimensionsStep },
  { id: 2, name: "Style", component: StyleStep },
  { id: 3, name: "Glass & Features", component: GlassFeaturesStep },
  { id: 4, name: "Finishing", component: FinishingStep },
  { id: 5, name: "Review", component: ReviewStep },
];

const Configure = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<WindowConfig>({
    width: 36,
    height: 48,
    openingType: "double-hung",
    thermalBreak: false,
    color: "white",
    horizontalUnits: 1,
    verticalUnits: 1,
    verticalPanes: 1,
    horizontalPanes: 1,
    glassType: "double-pane",
    screens: false,
    hardwareType: "standard",
  });

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;

  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Dimensions
        return config.width >= 12 && config.width <= 120 && config.height >= 12 && config.height <= 120;
      case 2: // Style
        return config.verticalPanes >= 1 && config.verticalPanes <= 3 && 
               config.horizontalPanes >= 1 && config.horizontalPanes <= 3;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length && isStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const updateConfig = (updates: Partial<WindowConfig>) => {
    setConfig({ ...config, ...updates });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Window Configurator</h1>
            <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">
              Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep > step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "border-accent-warm text-accent-warm bg-accent-warm/10"
                      : "border-border text-muted-foreground bg-background"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-12 md:w-24 mx-2 transition-all ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <CurrentStepComponent config={config} updateConfig={updateConfig} />
          
          {currentStep < steps.length && (
            <div className="mt-6">
              <PriceCalculator config={config} detailed={false} />
            </div>
          )}

          <div className="flex justify-between mt-8 pt-8 border-t">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={currentStep === steps.length || !isStepValid()}>
              {currentStep === steps.length ? (
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
