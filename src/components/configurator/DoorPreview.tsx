import { DoorStyle, LiteType } from "@/types/window-config";

interface DoorPreviewProps {
  width: number;
  height: number;
  doorStyle: DoorStyle;
  liteType: LiteType;
  doorPanels?: number;
  frameColor?: string;
  maxSize?: number;
}

const frameColorMap: Record<string, string> = {
  white: "#F5F5F5",
  black: "#1A1A1A",
  bronze: "#8B4513",
  champagne: "#F7E7CE",
  gray: "#6B7280",
  beige: "#D4C4A8",
  "forest-green": "#228B22",
};

const DoorPreview = ({ width, height, doorStyle, liteType, doorPanels = 2, frameColor = "white", maxSize = 350 }: DoorPreviewProps) => {
  if (width <= 0 || height <= 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Enter dimensions to see preview
      </div>
    );
  }

  const scale = Math.min(maxSize / width, maxSize / height);
  const sw = width * scale;
  const sh = height * scale;
  const frameW = 6;
  const fc = frameColorMap[frameColor] || frameColorMap.white;
  const glassFill = "hsl(200, 60%, 85%)";
  const glassStroke = "hsl(200, 40%, 65%)";
  const panelFill = "hsl(var(--muted))";
  const handleR = 4;

  const renderSingleDoor = (x: number, y: number, dw: number, dh: number, hingeLeft = true) => {
    const innerX = x + frameW;
    const innerY = y + frameW;
    const innerW = dw - frameW * 2;
    const innerH = dh - frameW * 2;

    const glassElements: JSX.Element[] = [];

    if (liteType === "full-lite") {
      glassElements.push(
        <rect key="glass" x={innerX + 4} y={innerY + 4} width={innerW - 8} height={innerH - 8}
          fill={glassFill} stroke={glassStroke} strokeWidth={1.5} rx={2} />
      );
    } else if (liteType === "half-lite") {
      const glassH = (innerH - 8) * 0.5;
      glassElements.push(
        <rect key="glass" x={innerX + 4} y={innerY + 4} width={innerW - 8} height={glassH}
          fill={glassFill} stroke={glassStroke} strokeWidth={1.5} rx={2} />,
        <rect key="panel" x={innerX + 4} y={innerY + 4 + glassH + 4} width={innerW - 8} height={innerH - 8 - glassH - 4}
          fill={panelFill} stroke={fc} strokeWidth={1} rx={2} />,
        <line key="rail" x1={innerX + 4} y1={innerY + 4 + glassH + 2} x2={innerX + innerW - 4} y2={innerY + 4 + glassH + 2}
          stroke={fc} strokeWidth={2} />
      );
    } else {
      glassElements.push(
        <rect key="panel" x={innerX + 4} y={innerY + 4} width={innerW - 8} height={innerH - 8}
          fill={panelFill} stroke={fc} strokeWidth={1} rx={2} />
      );
    }

    const handleX = hingeLeft ? innerX + innerW - 12 : innerX + 8;
    const handleY = innerY + innerH * 0.5;

    return (
      <g key={`door-${x}-${y}`}>
        <rect x={x} y={y} width={dw} height={dh} fill={fc} stroke="hsl(var(--foreground))" strokeWidth={2} rx={3} />
        <rect x={innerX} y={innerY} width={innerW} height={innerH} fill={fc} stroke="none" rx={1} />
        {glassElements}
        <circle cx={handleX} cy={handleY} r={handleR} fill="hsl(var(--foreground) / 0.6)" stroke="hsl(var(--foreground))" strokeWidth={1.5} />
        {[0.2, 0.8].map((pct, i) => {
          const hx = hingeLeft ? x + 2 : x + dw - 5;
          return (
            <rect key={`hinge-${i}`} x={hx} y={y + dh * pct - 4} width={3} height={8}
              fill="hsl(var(--foreground) / 0.4)" rx={1} />
          );
        })}
      </g>
    );
  };

  const renderMultiPanelGlass = (panels: number, isSliding: boolean) => {
    const innerW = sw - frameW * 2;
    const innerH = sh - frameW * 2;
    const panelW = innerW / panels;
    
    // For sliding doors, one panel overlaps slightly to show it slides
    // For bifold, panels have fold hinges between them
    return (
      <g>
        {/* Outer frame */}
        <rect x={0} y={0} width={sw} height={sh} fill={fc} stroke="hsl(var(--foreground))" strokeWidth={2} rx={3} />
        
        {/* Panels */}
        {Array.from({ length: panels }).map((_, i) => {
          const px = frameW + i * panelW;
          const isOperablePanel = isSliding 
            ? i === panels - 1  // last panel slides for sliding
            : true;             // all panels fold for bifold
          
          return (
            <g key={i}>
              {/* Glass panel */}
              <rect 
                x={px + 3} 
                y={frameW + 3} 
                width={panelW - 6} 
                height={innerH - 6}
                fill={glassFill} 
                stroke={isOperablePanel && isSliding ? "hsl(var(--foreground) / 0.5)" : glassStroke} 
                strokeWidth={isOperablePanel && isSliding ? 2 : 1.5} 
                rx={2} 
              />
              
              {/* Divider line between panels */}
              {i > 0 && (
                <line 
                  x1={px} y1={frameW} x2={px} y2={sh - frameW}
                  stroke="hsl(var(--foreground) / 0.5)" 
                  strokeWidth={2} 
                  strokeDasharray={isSliding ? "none" : "4,3"} 
                />
              )}
              
              {/* Bifold: hinge dots at fold points */}
              {!isSliding && i > 0 && [0.25, 0.5, 0.75].map((pct, hi) => (
                <circle key={hi} cx={px} cy={frameW + innerH * pct} r={2}
                  fill="hsl(var(--foreground) / 0.4)" />
              ))}
            </g>
          );
        })}
        
        {/* Handle */}
        {isSliding ? (
          // Sliding handle: vertical bar on the operable panel
          <rect 
            x={frameW + (panels - 1) * panelW + 4} 
            y={sh * 0.45} 
            width={3} height={sh * 0.1}
            fill="hsl(var(--foreground) / 0.6)" rx={1.5} 
          />
        ) : (
          // Bifold handle: on the leading panel edge
          <circle 
            cx={frameW + panelW - 8} 
            cy={sh * 0.5} 
            r={handleR} 
            fill="hsl(var(--foreground) / 0.6)" 
            stroke="hsl(var(--foreground))" strokeWidth={1.5} 
          />
        )}
        
        {/* Track line */}
        <line x1={frameW} y1={isSliding ? sh - 3 : 3} x2={sw - frameW} y2={isSliding ? sh - 3 : 3} 
          stroke="hsl(var(--foreground) / 0.3)" strokeWidth={1} />
        
        {/* Bifold also has bottom track */}
        {!isSliding && (
          <line x1={frameW} y1={sh - 3} x2={sw - frameW} y2={sh - 3} 
            stroke="hsl(var(--foreground) / 0.3)" strokeWidth={1} />
        )}
        
        {/* Label */}
        <text x={sw / 2} y={sh - frameW - 6} textAnchor="middle"
          fontSize={10} fill="hsl(var(--foreground) / 0.4)">
          {panels} panel{panels > 1 ? "s" : ""} • {isSliding ? "slides →" : "folds ↔"}
        </text>
      </g>
    );
  };

  const renderDoor = () => {
    switch (doorStyle) {
      case "single":
        return renderSingleDoor(0, 0, sw, sh, true);
      case "double":
        return (
          <g>
            {renderSingleDoor(0, 0, sw / 2, sh, true)}
            {renderSingleDoor(sw / 2, 0, sw / 2, sh, false)}
            <line x1={sw / 2} y1={0} x2={sw / 2} y2={sh} stroke="hsl(var(--foreground))" strokeWidth={2} />
          </g>
        );
      case "sliding":
        return renderMultiPanelGlass(doorPanels, true);
      case "bifold":
        return renderMultiPanelGlass(doorPanels, false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative" style={{ width: sw, height: sh }}>
        <svg width={sw} height={sh} className="overflow-visible">
          {renderDoor()}
        </svg>
        <div className="absolute -top-8 left-0 right-0 flex justify-center">
          <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
            {width}" ({(width / 12).toFixed(1)}')
          </div>
        </div>
        <div className="absolute -right-24 top-0 bottom-0 flex items-center">
          <div className="bg-background border border-border px-2 py-1 rounded text-sm font-medium">
            {height}" ({(height / 12).toFixed(1)}')
          </div>
        </div>
      </div>
      <div className="mt-12 text-sm text-muted-foreground">
        Area: <span className="font-semibold text-foreground">{((width * height) / 144).toFixed(2)} sq ft</span>
      </div>
    </div>
  );
};

export default DoorPreview;
