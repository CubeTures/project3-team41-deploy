export function calculateAdjustedPrice(basePrice: number, temp: number | null | undefined): number {
    if (!temp) return basePrice;
    const upperBound = 77;
    if (temp > upperBound) {
      return basePrice * (1 + (temp - upperBound) * 0.1);
    }
    const lowerBound = 65;
    if (temp < lowerBound) {
      return basePrice * (1 - (lowerBound - temp) * 0.01);
    }
    return basePrice;
  }