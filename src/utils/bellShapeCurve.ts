const CONST_M = Math.sqrt(2 * Math.PI);

export function bellShapeCurve(
  mean: number,
  variance: number,
  value: number,
): number {
  return Math.exp(-Math.pow(value - mean, 2) / (2 * variance)) / CONST_M;
}
