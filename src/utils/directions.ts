export type CompassDirection = 
  | 'Nor\''
  | 'Nor\'east'
  | 'East'
  | 'Sou\'east'
  | 'Sou\''
  | 'Sou\'west'
  | 'West'
  | 'Nor\'west'
  | 'Calm Seas'; // Fallback

// Pirate-themed direction labels
const PIRATE_DIRECTIONS: Record<string, CompassDirection> = {
  north: "Nor'",
  northeast: "Nor'east",
  east: "East",
  southeast: "Sou'east",
  south: "Sou'",
  southwest: "Sou'west",
  west: "West",
  northwest: "Nor'west"
} as const;

// Cardinal directions with angular ranges

// hard coded solution is just changing the names
const DIRECTION_RANGES: [number, number, CompassDirection][] = [
  [337.5, 22.5, 'Nor\''],      // North: 0°
  [22.5, 67.5, 'Nor\'east'],   // Northeast: 45°
  [67.5, 112.5, 'East'],       // East: 90°
  [112.5, 157.5, 'Sou\'east'], // Southeast: 135°
  [157.5, 202.5, 'Sou\''],     // South: 180°
  [202.5, 247.5, 'Sou\'west'], // Southwest: 225°
  [247.5, 292.5, 'West'],      // West: 270°
  [292.5, 337.5, 'Nor\'west']  // Northwest: 315°
];

// Convert numeric angle to pirate direction
export const getDirectionText = (angle: number): CompassDirection => {
  const normalizedAngle = (angle + 360) % 360;
  
  for (const [start, end, direction] of DIRECTION_RANGES) {
    if (normalizedAngle >= start && normalizedAngle < end) {
      return direction;
    }
  }
  return 'Nor\'';
};

// Format direction display with pirate lingo
export const formatDirectionDisplay = (
  direction: CompassDirection, 
  angle: number
): string => {
  const precisionAngle = angle.toFixed(1);
  return `${PIRATE_DIRECTIONS[direction.split(' ')[0]] || 'Arrr!'}\n${precisionAngle}°`;
};

// Get ordinal abbreviation (for coordinate display)
export const getOrdinal = (degrees: number): string => {
  const cardinal = degrees >= 0 ? 'N' : 'S';
  const ordinal = Math.abs(degrees).toFixed(3);
  return `${ordinal}° ${cardinal}`.replace('N', 'Nor\'').replace('S', 'Sou\'');
};

