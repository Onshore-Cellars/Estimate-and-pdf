import { ProductItem, ProcessedItem } from "@/types/catalog";

// Type mapping based on category
export function getType(category: string): string {
  const typeMap: { [key: string]: string } = {
    // Sake
    "Sake": "Sake",
    
    // Softs
    "Mixers": "Softs",
    "Syrups & Mixers": "Softs",
    
    // Beer
    "Hard Seltzer": "Beer",
    "Beer": "Beer",
    
    // Water
    "Water": "Water",
    
    // Spirits
    "Shochu": "Spirits",
    "Whisky": "Spirits",
    "Gin": "Spirits",
    "Rum": "Spirits",
    "Vodka": "Spirits",
    "Cognac": "Spirits",
    "Tequila": "Spirits",
    "Liqueur": "Spirits",
    "Brandy": "Spirits",
    "Mezcal": "Spirits",
    "Armagnac": "Spirits",
    "Calvados": "Spirits",
    "Absinthe": "Spirits",
    "Vermouth": "Spirits",
    "Amaro": "Spirits",
    
    // Other Items (to be filtered out)
    "Training": "Other Items",
    "Event": "Other Items",
    "Merchandise": "Other Items",
    "Gift Card": "Other Items",
    
    // Non-Alcoholic
    "Non-Alcoholic": "Non-Alcoholic",
    
    // Wine categories
    "Sparkling": "Wine",
    "Rosé": "Wine",
    "Red": "Wine",
    "White": "Wine",
    "Port": "Wine",
    "Sweet": "Wine",
    "Sherry": "Wine",
    "Madeira": "Wine",
    "Orange Wine": "Wine",
    "Kosher": "Wine",
  };
  
  return typeMap[category] || "";
}

// Type ordering
const TYPE_ORDER = ["Wine", "Non-Alcoholic", "Spirits", "Sake", "Beer", "Water", "Softs"];

// Wine category ordering
const WINE_CATEGORY_ORDER = [
  "Sparkling", "Rosé", "White", "Red", "Sweet", "Port", "Sherry", 
  "Madeira", "Orange Wine", "Kosher"
];

// Country ordering (France first, then Italy, then alphabetical)
function getCountryOrder(country: string): number {
  if (country === "France") return 0;
  if (country === "Italy") return 1;
  return 2;
}

// Generate sort key for item
export function generateSortKey(item: ProductItem): string {
  const type = getType(item.Category);
  const typeIndex = TYPE_ORDER.indexOf(type);
  const categoryIndex = WINE_CATEGORY_ORDER.indexOf(item.Category);
  const countryOrder = getCountryOrder(item.Country);
  
  return `${typeIndex.toString().padStart(2, '0')}-${categoryIndex.toString().padStart(2, '0')}-${countryOrder.toString().padStart(2, '0')}-${item.Country}-${item.Region}-${item.Appellation}-${item.SKU}`;
}

// Sort items according to the rules
export function sortItems(items: ProductItem[]): ProcessedItem[] {
  // Filter out "Other Items"
  const filtered = items.filter(item => getType(item.Category) !== "Other Items");
  
  // Add type and sort key to items
  const processed: ProcessedItem[] = filtered.map(item => ({
    ...item,
    type: getType(item.Category),
    sortKey: generateSortKey(item),
  }));
  
  // Sort by sort key
  return processed.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}
