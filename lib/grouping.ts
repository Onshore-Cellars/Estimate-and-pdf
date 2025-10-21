import { ProcessedItem, GroupedItems } from "@/types/catalog";

// Wine categories that should be grouped
const WINE_CATEGORIES = [
  "Sparkling", "Rosé", "White", "Red", "Sweet", "Port", "Sherry", 
  "Madeira", "Orange Wine", "Kosher"
];

// Spirit categories
const SPIRIT_CATEGORIES = [
  "Shochu", "Whisky", "Gin", "Rum", "Vodka", "Cognac", "Tequila", 
  "Liqueur", "Brandy", "Mezcal", "Armagnac", "Calvados", "Absinthe", 
  "Vermouth", "Amaro"
];

export function groupItems(items: ProcessedItem[]): GroupedItems[] {
  const groups: GroupedItems[] = [];
  
  // Group by type first
  const byType: { [key: string]: ProcessedItem[] } = {};
  
  items.forEach(item => {
    if (!byType[item.type]) {
      byType[item.type] = [];
    }
    byType[item.type].push(item);
  });
  
  // Process Wine items
  if (byType["Wine"]) {
    const wineByCategory: { [key: string]: ProcessedItem[] } = {};
    
    byType["Wine"].forEach(item => {
      if (!wineByCategory[item.Category]) {
        wineByCategory[item.Category] = [];
      }
      wineByCategory[item.Category].push(item);
    });
    
    const otherWines: ProcessedItem[] = [];
    
    WINE_CATEGORIES.forEach(category => {
      const categoryItems = wineByCategory[category] || [];
      
      if (categoryItems.length >= 4) {
        // Group separately
        groups.push(createGroup(category, categoryItems));
      } else if (categoryItems.length > 0) {
        // Add to "Other Wines"
        otherWines.push(...categoryItems);
      }
    });
    
    if (otherWines.length > 0) {
      groups.push(createGroup("Other Wines", otherWines));
    }
  }
  
  // Process Spirit items
  if (byType["Spirits"]) {
    const spiritByCategory: { [key: string]: ProcessedItem[] } = {};
    
    byType["Spirits"].forEach(item => {
      if (!spiritByCategory[item.Category]) {
        spiritByCategory[item.Category] = [];
      }
      spiritByCategory[item.Category].push(item);
    });
    
    const otherSpirits: ProcessedItem[] = [];
    
    SPIRIT_CATEGORIES.forEach(category => {
      const categoryItems = spiritByCategory[category] || [];
      
      if (categoryItems.length >= 4) {
        // Group separately
        groups.push(createGroup(category, categoryItems));
      } else if (categoryItems.length > 0) {
        // Add to "Other Spirits"
        otherSpirits.push(...categoryItems);
      }
    });
    
    if (otherSpirits.length > 0) {
      groups.push(createGroup("Other Spirits", otherSpirits));
    }
  }
  
  // Process other types (Non-Alcoholic, Sake, Beer, Water, Softs)
  ["Non-Alcoholic", "Sake", "Beer", "Water", "Softs"].forEach(type => {
    if (byType[type]) {
      groups.push(createGroup(type, byType[type]));
    }
  });
  
  return groups;
}

function createGroup(category: string, items: ProcessedItem[]): GroupedItems {
  const countries = [...new Set(items.map(item => item.Country))];
  const appellations = [...new Set(items.map(item => item.Appellation).filter(a => a))];
  const regions = [...new Set(items.map(item => item.Region).filter(r => r))];
  
  let commonAppellation: string | undefined;
  let commonRegion: string | undefined;
  let commonCountry: string | undefined;
  
  // Check if all items have the same appellation
  if (appellations.length === 1) {
    commonAppellation = appellations[0];
  } else if (regions.length === 1) {
    commonRegion = regions[0];
  } else if (countries.length === 1) {
    commonCountry = countries[0];
  }
  
  return {
    category,
    items,
    countries,
    appellation: commonAppellation,
    region: commonRegion,
    country: commonCountry,
  };
}

export function getCategoryDetail(group: GroupedItems): string {
  if (group.appellation) {
    return `${group.category} - ${group.appellation}`;
  }
  if (group.region) {
    return `${group.category} - ${group.region}`;
  }
  if (group.country) {
    return `${group.category} - ${group.country}`;
  }
  return group.category;
}
