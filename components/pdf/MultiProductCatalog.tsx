import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { GroupedItems, ProcessedItem } from '@/types/catalog';
import { formatPrice, combineDescriptionAndTastingNotes, cleanAppellation } from '@/lib/textProcessing';
import { getProductImage } from '@/lib/imageUtils';

// Define styles for A4 Portrait
const styles = StyleSheet.create({
  page: {
    width: 595.28, // A4 width in points
    height: 841.89, // A4 height in points
    padding: 20,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logo: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0A1E3E',
  },
  categoryInfo: {
    textAlign: 'right',
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#C8A882',
    marginBottom: 2,
  },
  countryList: {
    fontSize: 10,
    color: '#666666',
  },
  productRow: {
    marginBottom: 20,
    minHeight: 80,
  },
  changeMarker: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#C8A882',
    marginBottom: 4,
  },
  productContent: {
    flexDirection: 'row',
  },
  productImageContainer: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  productDetails: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    flex: 1,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  priceText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
  },
  availableText: {
    fontSize: 8,
    color: '#666666',
    marginTop: 2,
  },
  regionAppellation: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 4,
  },
  description: {
    fontSize: 8,
    color: '#8B0000',
    lineHeight: 1.3,
  },
});

interface MultiProductCatalogProps {
  groups: GroupedItems[];
  showRates?: boolean;
}

export const MultiProductCatalog: React.FC<MultiProductCatalogProps> = ({ 
  groups,
  showRates = true 
}) => {
  const itemsPerPage = 7;
  
  const renderProduct = (item: ProcessedItem, showChange: string | null, index: number) => (
    <View key={index} style={styles.productRow}>
      {showChange && (
        <Text style={styles.changeMarker}>{showChange}</Text>
      )}
      <View style={styles.productContent}>
        <View style={styles.productImageContainer}>
          <Image 
            src={getProductImage(
              item["Image URL"], 
              item.Category, 
              item.Region, 
              cleanAppellation(item.Appellation)
            )}
            style={styles.productImage}
          />
        </View>
        
        <View style={styles.productDetails}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{item["Item Name"]}</Text>
            {showRates && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {formatPrice(item["Selling Price"], item["Discount (%)"])}
                </Text>
                {item["Quantity On Hand"] > 0 && (
                  <Text style={styles.availableText}>
                    {item["Quantity On Hand"]} avail
                  </Text>
                )}
              </View>
            )}
          </View>
          
          <Text style={styles.regionAppellation}>
            {getRegionAppellationText(item)}
          </Text>
          
          <Text style={styles.description}>
            {combineDescriptionAndTastingNotes(
              item.Description,
              item["Tasting Notes"],
              455
            )}
          </Text>
        </View>
      </View>
    </View>
  );

  const getRegionAppellationText = (item: ProcessedItem): string => {
    const parts: string[] = [];
    
    // For spirits, include country
    if (item.type === "Spirits") {
      if (item.Country) parts.push(item.Country);
    }
    
    if (item.Region) parts.push(item.Region);
    const cleanedAppellation = cleanAppellation(item.Appellation);
    if (cleanedAppellation) parts.push(cleanedAppellation);
    
    return parts.join(', ');
  };

  const getChangeMarker = (
    item: ProcessedItem,
    prevItem: ProcessedItem | null,
    group: GroupedItems
  ): string | null => {
    if (!prevItem) return null;
    
    // For "Other Wines" or "Other Spirits", show category if it changes
    if (group.category === "Other Wines" || group.category === "Other Spirits") {
      if (item.Category !== prevItem.Category) {
        return item.Category;
      }
    }
    
    // For wine categories, show Appellation → Region → Country (whichever changes)
    if (group.category !== "Other Spirits") {
      const cleanedAppellation = cleanAppellation(item.Appellation);
      const prevCleanedAppellation = cleanAppellation(prevItem.Appellation);
      
      if (cleanedAppellation && cleanedAppellation !== prevCleanedAppellation) {
        return cleanedAppellation;
      }
      if (item.Region && item.Region !== prevItem.Region) {
        return item.Region;
      }
      if (item.Country && item.Country !== prevItem.Country) {
        return item.Country;
      }
    }
    
    return null;
  };

  const pages: React.ReactElement[] = [];
  
  groups.forEach((group, groupIndex) => {
    const items = group.items;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      const startIdx = pageNum * itemsPerPage;
      const endIdx = Math.min(startIdx + itemsPerPage, items.length);
      const pageItems = items.slice(startIdx, endIdx);
      
      pages.push(
        <Page key={`group-${groupIndex}-page-${pageNum}`} size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>ONSHORE CELLARS</Text>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>{group.category}</Text>
              {group.countries.length > 0 && (
                <Text style={styles.countryList}>
                  {group.countries.join(', ')}
                </Text>
              )}
            </View>
          </View>
          
          {pageItems.map((item, idx) => {
            const actualIdx = startIdx + idx;
            const prevItem = actualIdx > 0 ? items[actualIdx - 1] : null;
            const changeMarker = getChangeMarker(item, prevItem, group);
            
            return renderProduct(item, changeMarker, idx);
          })}
        </Page>
      );
    }
  });
  
  return <Document>{pages}</Document>;
};
