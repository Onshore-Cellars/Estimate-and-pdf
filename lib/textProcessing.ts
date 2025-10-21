// Create strikethrough text using Unicode combining character
export function strikeThrough(text: string): string {
  return text.split('').join('\u0336') + '\u0336';
}

// Format price with optional discount
export function formatPrice(sellingPrice: number, discountPercent: number): string {
  if (discountPercent > 0) {
    const discounted = sellingPrice - (sellingPrice * discountPercent / 100);
    return `${strikeThrough(`€${sellingPrice.toFixed(2)}`)} €${discounted.toFixed(2)}`;
  }
  return `€${sellingPrice.toFixed(2)}`;
}

// Truncate text to max length
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Truncate with line breaks every N characters
export function truncateWithBreaks(text: string, maxLength: number, breakEvery: number): string {
  const truncated = truncateText(text, maxLength);
  if (truncated.length < breakEvery) return truncated;
  
  const lines: string[] = [];
  for (let i = 0; i < truncated.length; i += breakEvery) {
    lines.push(truncated.substring(i, i + breakEvery));
  }
  return lines.join('\n');
}

// Clean description (replace multiple spaces with single space)
export function cleanDescription(text: string): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

// Clean appellation (remove "champagne" case-insensitive)
export function cleanAppellation(appellation: string): string {
  if (!appellation) return '';
  if (appellation.toLowerCase() === 'champagne') return '';
  return appellation;
}

// Count newlines in text
export function countNewlines(text: string): number {
  if (!text) return 0;
  return (text.match(/\n/g) || []).length;
}

// Combine description and tasting notes for multi-catalog
export function combineDescriptionAndTastingNotes(
  description: string,
  tastingNotes: string,
  maxTotal: number = 455
): string {
  const cleanDesc = cleanDescription(description);
  
  // If description has >= 3 newlines, omit tasting notes
  if (countNewlines(cleanDesc) >= 3) {
    return truncateText(cleanDesc, maxTotal);
  }
  
  // Otherwise combine with tasting notes
  const combined = cleanDesc + (cleanDesc && tastingNotes ? ' ' : '') + tastingNotes;
  return truncateText(combined, maxTotal);
}

// Check if all quantities are one
export function allQuantitiesAreOne(items: any[]): boolean {
  return items.every(item => 
    !item["Ordered Quantity"] || item["Ordered Quantity"] === 1
  );
}

// Format ABV as percentage
export function formatABV(abv: number): string {
  return `${(abv * 100).toFixed(1)}%`;
}
