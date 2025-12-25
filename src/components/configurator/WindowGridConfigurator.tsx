import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WindowConfig, WindowUnit, WindowRow, OpeningType, generateWindowUnits } from "@/types/window-config";
import { Layers, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WindowGridConfiguratorProps {
  config: WindowConfig;
  updateConfig: (updates: Partial<WindowConfig>) => void;
}

const openingTypeLabels: Record<OpeningType, string> = {
  "fixed": "Picture",
  "casement-left": "Casement (Left)",
  "casement-right": "Casement (Right)",
  "awning": "Awning",
  "hopper": "Hopper",
  "in-swing": "In-Swing",
  "out-swing": "Out-Swing",
  "double-hung": "Double Hung",
  "single-hung": "Single Hung",
};

const WindowGridConfigurator = ({ config, updateConfig }: WindowGridConfiguratorProps) => {
  const handleVerticalRowsChange = (value: string) => {
    const newRowCount = parseInt(value);
    const heightPerRow = config.height / newRowCount;
    
    // Create new rows, preserving existing configurations where possible
    const newRows: WindowRow[] = Array.from({ length: newRowCount }, (_, i) => {
      const existing = config.rows[i];
      return {
        rowNumber: i + 1,
        horizontalUnits: existing?.horizontalUnits || 1,
        height: heightPerRow,
      };
    });
    
    const newUnits = generateWindowUnits(newRows, config.width, config.height, config.openingType);
    
    // Preserve opening types from existing units
    newUnits.forEach(unit => {
      const existing = config.windowUnits.find(u => u.id === unit.id);
      if (existing) {
        unit.openingType = existing.openingType;
      }
    });
    
    updateConfig({
      verticalRows: newRowCount,
      verticalUnits: newRowCount,
      rows: newRows,
      windowUnits: newUnits,
      selectedWindowId: null,
    });
  };

  const handleHorizontalUnitsChange = (rowIndex: number, value: string) => {
    const newHorizontalUnits = parseInt(value);
    const newRows = config.rows.map((row, i) => 
      i === rowIndex ? { ...row, horizontalUnits: newHorizontalUnits } : row
    );
    
    const newUnits = generateWindowUnits(newRows, config.width, config.height, config.openingType);
    
    // Preserve opening types from existing units where possible
    newUnits.forEach(unit => {
      const existing = config.windowUnits.find(u => u.id === unit.id);
      if (existing) {
        unit.openingType = existing.openingType;
      }
    });
    
    updateConfig({
      rows: newRows,
      windowUnits: newUnits,
      horizontalUnits: Math.max(...newRows.map(r => r.horizontalUnits)),
    });
  };

  const handleWindowSelect = (windowId: string) => {
    updateConfig({ selectedWindowId: windowId });
  };

  const handleWindowTypeChange = (windowId: string, newType: OpeningType) => {
    const newUnits = config.windowUnits.map(unit =>
      unit.id === windowId ? { ...unit, openingType: newType } : unit
    );
    updateConfig({ windowUnits: newUnits });
  };

  const selectedWindow = config.windowUnits.find(u => u.id === config.selectedWindowId);

  // Group windows by row for display
  const windowsByRow: Record<number, WindowUnit[]> = {};
  config.windowUnits.forEach(unit => {
    if (!windowsByRow[unit.row]) {
      windowsByRow[unit.row] = [];
    }
    windowsByRow[unit.row].push(unit);
  });

  // Get row icon based on number of horizontal units
  const getRowIcon = (units: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: units }).map((_, i) => (
          <div key={i} className="w-2 h-4 bg-foreground/70 rounded-sm" />
        ))}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Main Configuration Header */}
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 py-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Window Configuration</span>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configure rows and windows in your opening</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Vertical Rows Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">Number of Vertical Rows</span>
              </div>
              <Select
                value={config.verticalRows.toString()}
                onValueChange={handleVerticalRowsChange}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Row{num > 1 ? 's' : ''} High
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row Configurations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.rows.map((row, rowIndex) => (
                <Card key={row.rowNumber} className={`border ${config.selectedWindowId?.startsWith(`W${row.rowNumber}.`) ? 'border-primary' : 'border-muted'}`}>
                  <CardHeader className="py-2 px-3 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Row #{row.rowNumber}</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Set windows for row {row.rowNumber}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 space-y-3">
                    {/* Horizontal Units for this Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRowIcon(row.horizontalUnits)}
                        <span className="text-xs text-muted-foreground">Horizontal Windows</span>
                      </div>
                      <Select
                        value={row.horizontalUnits.toString()}
                        onValueChange={(value) => handleHorizontalUnitsChange(rowIndex, value)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Window{num > 1 ? 's' : ''} Wide
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clickable Window Cells */}
                    <div className="text-xs text-muted-foreground text-center">
                      Click on a window to edit
                    </div>
                    <div 
                      className="grid gap-1"
                      style={{ gridTemplateColumns: `repeat(${row.horizontalUnits}, 1fr)` }}
                    >
                      {windowsByRow[row.rowNumber]?.map(unit => (
                        <button
                          key={unit.id}
                          onClick={() => handleWindowSelect(unit.id)}
                          className={`p-2 rounded border-2 transition-all text-left ${
                            config.selectedWindowId === unit.id
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                              : 'border-accent-warm bg-accent-warm/20 hover:bg-accent-warm/30'
                          }`}
                        >
                          <div className="text-xs font-bold">{unit.id}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {unit.width.toFixed(0)}" × {unit.height.toFixed(0)}"
                          </div>
                          <div className="text-[10px] truncate">
                            {openingTypeLabels[unit.openingType]}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Row Height */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Label className="text-xs">Row Height</Label>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={row.height.toFixed(3)}
                          className="w-20 h-7 text-xs text-right"
                          readOnly
                        />
                        <span className="text-xs text-muted-foreground">in</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Window Options */}
        {selectedWindow && (
          <Card className="border-primary">
            <CardHeader className="bg-primary py-2 px-4">
              <CardTitle className="text-sm text-primary-foreground flex items-center justify-between">
                <span>{selectedWindow.id} Specific Options</span>
                <Badge variant="secondary" className="text-[10px]">
                  {selectedWindow.width.toFixed(0)}" × {selectedWindow.height.toFixed(0)}"
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Window Type</Label>
                <Select
                  value={selectedWindow.openingType}
                  onValueChange={(value) => handleWindowTypeChange(selectedWindow.id, value as OpeningType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(openingTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {selectedWindow.id} - {label} - {selectedWindow.width.toFixed(3)}x{selectedWindow.height.toFixed(3)}"
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Unit Width</Label>
                  <div className="text-lg font-semibold">{selectedWindow.width.toFixed(3)}"</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Unit Height</Label>
                  <div className="text-lg font-semibold">{selectedWindow.height.toFixed(3)}"</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visual Grid Preview */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Opening Layout Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 flex justify-center">
              <div className="border-4 border-foreground/30 rounded bg-background p-2 inline-block">
                {config.rows.map(row => (
                  <div 
                    key={row.rowNumber}
                    className="flex gap-1 mb-1 last:mb-0"
                  >
                    {windowsByRow[row.rowNumber]?.map(unit => (
                      <div
                        key={unit.id}
                        onClick={() => handleWindowSelect(unit.id)}
                        className={`
                          w-16 h-16 rounded border-2 cursor-pointer transition-all
                          flex flex-col items-center justify-center text-center
                          ${config.selectedWindowId === unit.id 
                            ? 'border-primary bg-primary/20' 
                            : 'border-muted-foreground/30 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900'
                          }
                        `}
                      >
                        <span className="text-[10px] font-bold">{unit.id}</span>
                        <span className="text-[8px] text-muted-foreground">
                          {openingTypeLabels[unit.openingType].split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Total: {config.windowUnits.length} window unit{config.windowUnits.length > 1 ? 's' : ''} • 
              Opening: {config.width}" × {config.height}"
            </p>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default WindowGridConfigurator;
