import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WindowConfig } from "@/types/window-config";
import { calculatePrice, PriceBreakdown } from "@/lib/pricing";
import { DollarSign } from "lucide-react";

interface PriceCalculatorProps {
  config: WindowConfig;
  detailed?: boolean;
}

const PriceCalculator = ({ config, detailed = true }: PriceCalculatorProps) => {
  const breakdown: PriceBreakdown = calculatePrice(config);
  const areaFt2 = ((config.width * config.height) / 144).toFixed(2);
  
  if (!detailed) {
    return (
      <div className="bg-accent-warm/10 border border-accent-warm/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-accent-warm" />
            <span className="font-semibold text-foreground">Estimated Price:</span>
          </div>
          <span className="text-2xl font-bold text-accent-warm">
            ${breakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <Card className="border-accent-warm/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-accent-warm" />
          Price Breakdown
        </CardTitle>
        <CardDescription>
          Estimated price for {areaFt2} sq ft window
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Base Price */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Price ({areaFt2} sq ft)</span>
            <span className="font-mono">
              ${breakdown.base.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        {/* Multipliers */}
        {breakdown.multipliers.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">
                Feature Adjustments {breakdown.multiplierFactor !== 1 && (
                  <span className="text-xs text-muted-foreground font-normal">
                    (×{breakdown.multiplierFactor.toFixed(3)})
                  </span>
                )}
              </div>
              {breakdown.multipliers.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm pl-4">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-mono text-accent-warm">
                    +${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Flat Adds */}
        {breakdown.flats.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Additional Items</div>
              {breakdown.flats.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm pl-4">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-mono text-accent-warm">
                    +${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Total */}
        <Separator className="bg-accent-warm/20" />
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-foreground">Total Estimated Price</span>
          <span className="text-2xl font-bold text-accent-warm">
            ${breakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="text-xs text-muted-foreground pt-2">
          * Prices are estimates and may vary. Final pricing will be confirmed upon order review.
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCalculator;