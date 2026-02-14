import { ProductType } from "@/types/window-config";
import { DoorOpen, AppWindow } from "lucide-react";

interface ProductTypeSelectorProps {
  value: ProductType;
  onChange: (type: ProductType) => void;
}

const options: { value: ProductType; label: string; icon: typeof AppWindow; description: string }[] = [
  { value: "window", label: "Window", icon: AppWindow, description: "Custom windows for any opening" },
  { value: "door", label: "Door", icon: DoorOpen, description: "Entry, patio, and specialty doors" },
];

const ProductTypeSelector = ({ value, onChange }: ProductTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((opt) => {
        const Icon = opt.icon;
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
              selected
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : "border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/50"
            }`}
          >
            <Icon className={`w-10 h-10 ${selected ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-center">
              <p className={`font-semibold text-lg ${selected ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ProductTypeSelector;
