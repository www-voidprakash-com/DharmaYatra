
import React from 'react';
import { SquareData, Player, SnakeLadderInfo } from '../types';
import Square from './Square';
import { PLAYER_INITIAL_POSITION, SNAKES_LADDERS_MAP } from '../constants';
import AnimalIcon from './AnimalIcon';

interface BoardProps {
  squares: SquareData[];
  players: Player[];
  activeSpecialSquare?: { id: number; type: 'snake' | 'ladder' } | null;
}

const SNAKE_THEMES = [
  { main: "#b91c1c", secondary: "#7f1d1d", pattern: "#ef4444", eye: "#fbbf24" }, // Deep Red
  { main: "#15803d", secondary: "#14532d", pattern: "#4ade80", eye: "#facc15" }, // Forest Green
  { main: "#7e22ce", secondary: "#581c87", pattern: "#c084fc", eye: "#00ff00" }, // Royal Purple
  { main: "#c2410c", secondary: "#7c2d12", pattern: "#fb923c", eye: "#00ffff" }, // Burnt Orange
  { main: "#374151", secondary: "#111827", pattern: "#9ca3af", eye: "#ff0000" }, // Charcoal
  { main: "#1d4ed8", secondary: "#1e3a8a", pattern: "#60a5fa", eye: "#fbbf24" }, // Deep Blue
  { main: "#be185d", secondary: "#831843", pattern: "#f472b6", eye: "#fef08a" }, // Pink/Magenta
  { main: "#0f766e", secondary: "#115e59", pattern: "#5eead4", eye: "#fdba74" }, // Teal
];

// Helper function to get visual grid cell coordinates
const getVisualGridCell = (squareId: number, visualBoardLayout: number[][]): [number, number] | null => {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if (visualBoardLayout[r][c] === squareId) {
        return [r, c]; 
      }
    }
  }
  return null;
};

const getSquareCenterPercentCoords = (
  squareId: number,
  visualBoardLayout: number[][]
): [number, number] | null => {
  const coords = getVisualGridCell(squareId, visualBoardLayout);
  if (!coords) return null;
  const [visualRow, visualCol] = coords;
  const xPercent = visualCol * 10 + 5; 
  const yPercent = visualRow * 10 + 5; 
  return [xPercent, yPercent];
};

const getPlayerOffsetStyle = (index: number, totalPlayers: number): React.CSSProperties => {
  if (totalPlayers <= 1) return { transform: 'translate(-50%, -50%)' };
  const angle = (index / totalPlayers) * 2 * Math.PI;
  const r = 2.0; // Slightly larger offset for visibility
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;
  return { 
      transform: `translate(calc(-50% + ${x}%), calc(-50% + ${y}%))` 
  };
};

const Board: React.FC<BoardProps> = ({ squares, players, activeSpecialSquare }) => {
  const visualBoardGrid: number[][] = [];
  for (let i = 0; i < 10; i++) { 
    const currentRow: number[] = [];
    const baseNum = (9 - i) * 10; 
    if ((9 - i) % 2 === 0) { 
      for (let j = 1; j <= 10; j++) { 
        currentRow.push(baseNum + j);
      }
    } else { 
      for (let j = 10; j >= 1; j--) { 
        currentRow.push(baseNum + j);
      }
    }
    visualBoardGrid.push(currentRow); 
  }

  // --- High Fidelity Snake Renderer ---
  const renderSnake = (x1: number, y1: number, x2: number, y2: number, key: string, seed: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;
    
    const themeIndex = seed % SNAKE_THEMES.length;
    const theme = SNAKE_THEMES[themeIndex];
    
    const nx = -dy / len;
    const ny = dx / len;
    
    let pathData = `M ${x1} ${y1}`;
    
    // Determine if "Small Snake" (length based threshold, e.g., < 35% of board diagonal roughly)
    // Board is 100x100. A drop of 2 rows is ~20 units.
    const isSmallSnake = len < 30;

    if (isSmallSnake) {
        // --- 2nd Degree (Quadratic) Bezier Curve for Small Snakes ---
        // One control point to create a simple arch
        const amp = 8 * ((seed % 2 === 0) ? 1 : -1); 
        const cp1x = x1 + dx * 0.5 + nx * amp;
        const cp1y = y1 + dy * 0.5 + ny * amp;
        
        pathData += ` Q ${cp1x} ${cp1y}, ${x2} ${y2}`;
    } else {
        // --- Higher Order Multi-Segment Bezier for Long Snakes ---
        const segments = Math.max(3, Math.floor(len / 20));
        
        for (let i = 0; i < segments; i++) {
            const tStart = i / segments;
            const tEnd = (i + 1) / segments;
            
            const pxStart = x1 + dx * tStart;
            const pyStart = y1 + dy * tStart;
            const pxEnd = x1 + dx * tEnd;
            const pyEnd = y1 + dy * tEnd;
            
            // Amplitude
            const amp = (6 + (seed % 4)) * (i % 2 === 0 ? 1 : -1); 
            
            // Cubic Bezier Control Points
            const cp1x = pxStart + (dx/segments)*0.4 + nx * amp;
            const cp1y = pyStart + (dy/segments)*0.4 + ny * amp;
            
            const cp2x = pxEnd - (dx/segments)*0.4 + nx * amp;
            const cp2y = pyEnd - (dy/segments)*0.4 + ny * amp;
            
            pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pxEnd} ${pyEnd}`;
        }
    }

    // Thinner borders for better visibility
    const bodyWidth = 2.8;
    const borderWidth = 3.6; 

    return (
        <g key={key} className="snake-group">
            {/* Drop Shadow */}
            <path d={pathData} stroke="rgba(0,0,0,0.15)" strokeWidth={borderWidth} fill="none" transform="translate(1, 2)" filter="url(#blur-filter)" />

            {/* Border/Outline */}
            <path d={pathData} stroke="#292524" strokeWidth={borderWidth} fill="none" strokeLinecap="round" opacity="0.6" />

            {/* Main Body with Gradient */}
            <path 
                d={pathData} 
                stroke={`url(#snakeGradient-${themeIndex})`} 
                strokeWidth={bodyWidth} 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#bevel-filter)"
            />
            
            {/* Pattern Overlay (Scales) - Reduced opacity */}
            <path 
                d={pathData} 
                stroke={theme.pattern} 
                strokeWidth="0.8" 
                fill="none" 
                strokeDasharray="0.5, 2.5" 
                strokeLinecap="round" 
                opacity="0.5"
                transform="translate(0, -0.5)"
            />

            {/* Head */}
            <g transform={`translate(${x1}, ${y1})`}>
                <ellipse cx="0" cy="0" rx="3.0" ry="4.0" fill={theme.main} stroke="#292524" strokeWidth="0.5" filter="url(#bevel-filter)" />
                <path d="M -0.8 2 L 0 5 L 0.8 2 Z" fill="#ef4444" /> {/* Tongue */}
                <circle cx="-1.2" cy="-1.5" r="0.9" fill={theme.eye} />
                <circle cx="1.2" cy="-1.5" r="0.9" fill={theme.eye} />
                <circle cx="-1.2" cy="-1.5" r="0.3" fill="black" />
                <circle cx="1.2" cy="-1.5" r="0.3" fill="black" />
            </g>
        </g>
    );
  };

  // --- High Fidelity Ladder Renderer (Sleek Golden Shiny) ---
  const renderLadder = (x1: number, y1: number, x2: number, y2: number, key: string) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    const nx = -dy / len;
    const ny = dx / len;
    
    // Thinner, sleeker width
    const width = 1.6; 

    const r1x1 = x1 + nx * width; const r1y1 = y1 + ny * width;
    const r1x2 = x2 + nx * width; const r1y2 = y2 + ny * width;
    const r2x1 = x1 - nx * width; const r2y1 = y1 - ny * width;
    const r2x2 = x2 - nx * width; const r2y2 = y2 - ny * width;

    const numRungs = Math.floor(len / 8.5); 
    const rungs = [];

    // Sparkle helper
    const renderSparkle = (cx: number, cy: number, scale: number = 1, id: number) => (
       <path 
         key={`sparkle-${id}`}
         d={`M ${cx} ${cy-2*scale} L ${cx+0.5*scale} ${cy-0.5*scale} L ${cx+2*scale} ${cy} L ${cx+0.5*scale} ${cy+0.5*scale} L ${cx} ${cy+2*scale} L ${cx-0.5*scale} ${cy+0.5*scale} L ${cx-2*scale} ${cy} L ${cx-0.5*scale} ${cy-0.5*scale} Z`}
         fill="white"
         className="animate-pulse"
         filter="url(#sparkle-glow)"
         opacity="1"
       />
    );

    for(let i=1; i<=numRungs; i++) {
        const t = i / (numRungs + 1);
        const mx = x1 + dx * t;
        const my = y1 + dy * t;
        
        rungs.push(
            <g key={`rung-${i}`}>
                {/* Rung Shadow */}
                <line 
                    x1={mx + nx * width + 0.5} y1={my + ny * width + 1}
                    x2={mx - nx * width + 0.5} y2={my - ny * width + 1}
                    stroke="rgba(0,0,0,0.2)" strokeWidth="0.8"
                    filter="url(#blur-filter)"
                />
                {/* Rung Base (Gold) */}
                <line 
                    x1={mx + nx * width} y1={my + ny * width}
                    x2={mx - nx * width} y2={my - ny * width}
                    stroke="url(#goldGradient)" strokeWidth="1.2" strokeLinecap="butt"
                />
                 {/* Rung Texture (Wood/Grain hint) */}
                 <line 
                    x1={mx + nx * width} y1={my + ny * width}
                    x2={mx - nx * width} y2={my - ny * width}
                    stroke="#854d0e" strokeWidth="0.3" strokeDasharray="1, 1" strokeLinecap="butt"
                    opacity="0.2"
                />
                {/* Rung Highlight (Sharp) */}
                <line 
                    x1={mx + nx * width} y1={my + ny * width}
                    x2={mx - nx * width} y2={my - ny * width}
                    stroke="rgba(255,255,255,0.9)" strokeWidth="0.4" strokeLinecap="butt"
                    transform="translate(0, -0.3)"
                />
                {/* Sparkle on random rungs */}
                {(i * 7 + key.length) % 5 === 0 && renderSparkle(mx, my, 0.5, i * 100)}
            </g>
        );
    }

    return (
        <g key={key}>
             {/* Backdrop Glow for Visibility on dark squares (71, 80) */}
             <line x1={r1x1} y1={r1y1} x2={r1x2} y2={r1y2} stroke="rgba(255,255,255,0.5)" strokeWidth="3.0" strokeLinecap="round" />
             <line x1={r2x1} y1={r2y1} x2={r2x2} y2={r2y2} stroke="rgba(255,255,255,0.5)" strokeWidth="3.0" strokeLinecap="round" />

             {/* Rail Shadows */}
            <line x1={r1x1+0.5} y1={r1y1+0.5} x2={r1x2+0.5} y2={r1y2+0.5} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" filter="url(#blur-filter)" />
            <line x1={r2x1+0.5} y1={r2y1+0.5} x2={r2x2+0.5} y2={r2y2+0.5} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" filter="url(#blur-filter)" />
            
            {/* Gold Rails - Thinner borders */}
            <line x1={r1x1} y1={r1y1} x2={r1x2} y2={r1y2} stroke="url(#goldGradient)" strokeWidth="1.8" strokeLinecap="round" />
            <line x1={r2x1} y1={r2y1} x2={r2x2} y2={r2y2} stroke="url(#goldGradient)" strokeWidth="1.8" strokeLinecap="round" />
            
             {/* Rail Texture (Grain) */}
             <line x1={r1x1} y1={r1y1} x2={r1x2} y2={r1y2} stroke="#854d0e" strokeWidth="0.3" strokeDasharray="3, 4" opacity="0.2" strokeLinecap="round" />
             <line x1={r2x1} y1={r2y1} x2={r2x2} y2={r2y2} stroke="#854d0e" strokeWidth="0.3" strokeDasharray="3, 4" opacity="0.2" strokeLinecap="round" />

            {/* Rail Highlight (Sharp) */}
             <line x1={r1x1} y1={r1y1} x2={r1x2} y2={r1y2} stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" strokeLinecap="round" transform="translate(-0.3, -0.3)" />
             <line x1={r2x1} y1={r2y1} x2={r2x2} y2={r2y2} stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" strokeLinecap="round" transform="translate(-0.3, -0.3)" />

            {/* Knots/Joints at Ends - Smaller */}
            <circle cx={r1x1} cy={r1y1} r="1.0" fill="url(#goldGradient)" stroke="#854d0e" strokeWidth="0.3" />
            <circle cx={r1x2} cy={r1y2} r="1.0" fill="url(#goldGradient)" stroke="#854d0e" strokeWidth="0.3" />
            <circle cx={r2x1} cy={r2y1} r="1.0" fill="url(#goldGradient)" stroke="#854d0e" strokeWidth="0.3" />
            <circle cx={r2x2} cy={r2y2} r="1.0" fill="url(#goldGradient)" stroke="#854d0e" strokeWidth="0.3" />

            {/* Sparkles on Rails */}
            {renderSparkle(r1x1 + (r1x2-r1x1)*0.2, r1y1 + (r1y2-r1y1)*0.2, 0.8, 1000)}
            {renderSparkle(r2x1 + (r2x2-r2x1)*0.8, r2y1 + (r2y2-r2y1)*0.8, 0.7, 2000)}

            {rungs}
        </g>
    );
  };

  return (
    <div className="relative group w-full max-w-xl lg:max-w-2xl select-none">
      
      {/* Ornate Board Frame */}
      <div className="rounded-lg p-2 bg-[#4a3b2a] shadow-2xl relative">
        <div className="absolute inset-0 border-2 border-[#8b6b4a] rounded-lg pointer-events-none"></div>
        <div className="absolute inset-1 border border-[#d4af37] rounded-md opacity-50 pointer-events-none"></div>
        
        {/* Main Board Area */}
        <div className="grid grid-cols-10 grid-rows-10 bg-[#fdf6e3] aspect-square w-full relative overflow-hidden rounded shadow-inner">
            
            {/* SVG Layer for Snakes, Ladders, and Definitions - Z-Index 40 to stay above squares (Z-30 max) but below tokens (Z-50) */}
            <svg
            className="absolute top-0 left-0 w-full h-full z-40 pointer-events-none"
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            >
            <defs>
                {/* 3D Bevel Filter for Snakes */}
                <filter id="bevel-filter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="0.4" result="blur"/>
                    <feSpecularLighting in="blur" surfaceScale="2" specularConstant="1.2" specularExponent="15" result="specOut">
                        <fePointLight x="-5000" y="-10000" z="20000"/>
                    </feSpecularLighting>
                    <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
                    <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
                </filter>

                {/* Blur Filter for Shadows */}
                <filter id="blur-filter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
                </filter>
                
                {/* Sparkle Glow */}
                <filter id="sparkle-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>

                {/* Sleek Golden Gradient */}
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(45)">
                    <stop offset="0%" stopColor="#b45309" />   {/* Dark Amber */}
                    <stop offset="20%" stopColor="#fbbf24" />  {/* Amber 400 */}
                    <stop offset="40%" stopColor="#fcd34d" />  {/* Amber 300 */}
                    <stop offset="50%" stopColor="#ffffff" />  {/* Shine */}
                    <stop offset="60%" stopColor="#fcd34d" />
                    <stop offset="80%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                </linearGradient>

                {/* Snake Gradients generated dynamically based on themes */}
                {SNAKE_THEMES.map((theme, i) => (
                    <linearGradient id={`snakeGradient-${i}`} key={i} gradientTransform="rotate(90)">
                        <stop offset="0%" stopColor={theme.secondary} />
                        <stop offset="30%" stopColor={theme.main} />
                        <stop offset="50%" stopColor={theme.pattern} />
                        <stop offset="70%" stopColor={theme.main} />
                        <stop offset="100%" stopColor={theme.secondary} />
                    </linearGradient>
                ))}
            </defs>

            {Object.entries(SNAKES_LADDERS_MAP).map(([fromStr, info]) => {
                const from = parseInt(fromStr);
                const to = info.to;
                const type = info.type;

                const fromCoords = getSquareCenterPercentCoords(from, visualBoardGrid);
                const toCoords = getSquareCenterPercentCoords(to, visualBoardGrid);

                if (!fromCoords || !toCoords) return null;

                const [x1, y1] = fromCoords;
                const [x2, y2] = toCoords;

                if (type === 'snake') {
                    return renderSnake(x1, y1, x2, y2, `sl-${from}-${to}`, info.themeIndex ?? from);
                } else {
                    return renderLadder(x1, y1, x2, y2, `sl-${from}-${to}`);
                }
            })}
            </svg>
            
            {/* Squares Rendering */}
            {visualBoardGrid.flat().map((squareNumber) => {
            const squareData = squares[squareNumber - 1];
            if (!squareData) return null;
            
            return (
                <Square
                key={squareData.id}
                data={squareData}
                activeEffect={activeSpecialSquare?.id === squareData.id ? activeSpecialSquare.type : null}
                />
            );
            })}

            {/* Token Layer - Z-Index 50 */}
            <div className="absolute inset-0 z-50 pointer-events-none">
            {players.map((player) => {
                if (player.position <= 0) return null;

                const coords = getSquareCenterPercentCoords(player.position, visualBoardGrid);
                if (!coords) return null;

                const [xPercent, yPercent] = coords;
                const playersOnThisSquare = players.filter(p => p.position === player.position);
                const indexOnSquare = playersOnThisSquare.findIndex(p => p.id === player.id);
                const offsetStyle = getPlayerOffsetStyle(indexOnSquare, playersOnThisSquare.length);

                return (
                <div
                    key={player.id}
                    className={`absolute w-5 h-5 sm:w-6 sm:h-6 rounded-full ${player.color.tailwindClass} ring-2 ring-white shadow-[0_3px_6px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) player-peg`}
                    style={{
                    left: `${xPercent}%`, 
                    top: `${yPercent}%`, 
                    ...offsetStyle
                    }}
                >
                    <AnimalIcon iconKey={player.animalIcon.iconKey} className="w-3.5 h-3.5 text-white drop-shadow-md animal-icon-on-peg" />
                </div>
                );
            })}
            </div>

        </div>
      </div>
    </div>
  );
};

export default Board;
