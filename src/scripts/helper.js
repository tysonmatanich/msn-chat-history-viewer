export function roundNumber(number, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}

export function basicPluralString(string, number) {
  return `${number} ${string}${number > 1 ? "s" : ""}`;
}
