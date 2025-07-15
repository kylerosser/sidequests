export const parseNumber = (value: unknown): number => {
  const num = parseFloat(value as string);
  if (isNaN(num)) throw new Error("Invalid number");
  return num;
}