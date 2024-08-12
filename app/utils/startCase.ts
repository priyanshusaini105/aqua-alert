export function startCase(string: string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  const result = string
    .replace(/([A-Z])/g, " $1") // Insert space before capital letters
    .replace(/[_-]/g, " ") // Replace underscores and hyphens with spaces
    .trim(); // Remove leading/trailing spaces

  return result.charAt(0).toUpperCase() + result.slice(1);
}
