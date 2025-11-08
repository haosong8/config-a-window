export type OpeningType = "in-swing" | "out-swing" | "double-hung" | "single-hung";
export type GlassType = "double-pane" | "triple-pane";
export type HardwareType = "standard" | "premium" | "luxury";

export interface WindowConfig {
  width: number;
  height: number;
  openingType: OpeningType;
  thermalBreak: boolean;
  color: string;
  verticalPanes: number;
  horizontalPanes: number;
  glassType: GlassType;
  screens: boolean;
  hardwareType: HardwareType;
}
