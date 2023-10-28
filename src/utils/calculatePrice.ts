export default function calculatePizzaPrice(
  size: string,
  selectedToppings: string[],
) {
  const basePrices: Record<string, number> = {
    Small: 6.99,
    Medium: 8.99,
    Large: 11.99,
  };

  const includedToppings: Record<string, number> = {
    Small: 2,
    Medium: 3,
    Large: 5,
  };

  const extraToppingsPrice =
    Math.max(0, selectedToppings.length - (includedToppings[size] ?? 0)) * 1.49;

  const basePrice = basePrices[size] ?? 0;
  return basePrice + extraToppingsPrice;
}
