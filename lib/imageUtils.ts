// Fallback images by category
const FALLBACK_IMAGES: { [key: string]: any } = {
  "Red": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0039.jpg",
  "White": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0043.jpg",
  "Rosé": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0041.jpg",
  "Sparkling": {
    default: "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0040.jpg",
    champagne: "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0042.jpg"
  },
  "Port": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0044.jpg",
  "Sweet": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0045.jpg",
  "Sherry": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0046.jpg",
  "Madeira": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0047.jpg",
  "Orange Wine": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0048.jpg",
  "Whisky": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0049.jpg",
  "Gin": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0050.jpg",
  "Rum": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0051.jpg",
  "Vodka": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0052.jpg",
  "Cognac": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0053.jpg",
  "Tequila": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0054.jpg",
  "Liqueur": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0055.jpg",
  "Sake": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0056.jpg",
  "Beer": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0057.jpg",
  "Non-Alcoholic": "https://cdn.shopify.com/s/files/1/0995/6758/files/IMG_0058.jpg",
};

const DEFAULT_IMAGE = "https://cdn.shopify.com/s/files/1/0995/6758/files/placeholder.jpg";

export function getFallbackImage(category: string, region?: string, appellation?: string): string {
  if (category === "Sparkling") {
    // Check if it's champagne
    const regionLower = (region || '').toLowerCase();
    const appellationLower = (appellation || '').toLowerCase();
    
    if (regionLower.includes("champagne") || appellationLower.includes("champagne")) {
      return FALLBACK_IMAGES.Sparkling.champagne;
    }
    return FALLBACK_IMAGES.Sparkling.default;
  }
  
  return FALLBACK_IMAGES[category] || DEFAULT_IMAGE;
}

export function getProductImage(
  imageUrl: string,
  category: string,
  region?: string,
  appellation?: string
): string {
  // If image URL exists and is valid, use it
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  
  // Otherwise use fallback
  return getFallbackImage(category, region, appellation);
}
