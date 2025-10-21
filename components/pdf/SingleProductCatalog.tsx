import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { ProcessedItem } from '@/types/catalog';
import { formatPrice, truncateWithBreaks, formatABV, cleanAppellation } from '@/lib/textProcessing';
import { getProductImage } from '@/lib/imageUtils';

// Define styles for A5 Landscape
const styles = StyleSheet.create({
  page: {
    width: 595.28, // A5 landscape width in points
    height: 419.53, // A5 landscape height in points
    padding: 0,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  logo: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0A1E3E',
  },
  category: {
    fontSize: 12,
    color: '#C8A882',
    fontFamily: 'Helvetica-Bold',
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#000000',
  },
  regionText: {
    fontSize: 11,
    color: '#C8A882',
    marginBottom: 8,
  },
  fieldsGrid: {
    marginTop: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  fieldLabel: {
    width: 100,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
  },
  fieldValue: {
    flex: 1,
    fontSize: 10,
    color: '#000000',
  },
  tastingNotesBox: {
    backgroundColor: '#0A1E3E',
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 12,
    marginTop: 12,
  },
  tastingNotesText: {
    fontSize: 9,
    color: '#FFFFFF',
    lineHeight: 1.4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 12,
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
  },
  parkerPoints: {
    fontSize: 10,
    color: '#666666',
  },
  abvText: {
    fontSize: 12,
    color: '#000000',
  },
  quantityText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
});

interface SingleProductCatalogProps {
  items: ProcessedItem[];
  showQuantity?: boolean;
}

export const SingleProductCatalog: React.FC<SingleProductCatalogProps> = ({ 
  items,
  showQuantity = true 
}) => {
  return (
    <Document>
      {items.map((item, index) => (
        <Page key={index} size={[595.28, 419.53]} style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>ONSHORE CELLARS</Text>
            <Text style={styles.category}>{item.Category}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
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

            {/* Details */}
            <View style={styles.details}>
              <Text style={styles.itemName}>{item["Item Name"]}</Text>
              <Text style={styles.regionText}>
                {[item.Country, item.Region].filter(x => x).join(', ')}
              </Text>

              {/* Combined Fields */}
              <View style={styles.fieldsGrid}>
                {item["Style Multi Select"] && (
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Style:</Text>
                    <Text style={styles.fieldValue}>{item["Style Multi Select"]}</Text>
                  </View>
                )}
                {item["Grapes Blend"] && (
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Grapes:</Text>
                    <Text style={styles.fieldValue}>{item["Grapes Blend"]}</Text>
                  </View>
                )}
                {item["Pairs With"] && (
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Pairs With:</Text>
                    <Text style={styles.fieldValue}>{item["Pairs With"]}</Text>
                  </View>
                )}
                {item["Serving Suggestion"] && (
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Serving:</Text>
                    <Text style={styles.fieldValue}>{item["Serving Suggestion"]}</Text>
                  </View>
                )}
                {item["Ageing"] && (
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Ageing:</Text>
                    <Text style={styles.fieldValue}>{item["Ageing"]}</Text>
                  </View>
                )}
                {item["Sweetness"] && (
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Sweetness:</Text>
                    <Text style={styles.fieldValue}>{item["Sweetness"]}</Text>
                  </View>
                )}
                {item["Drinking Window"] && (
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Drinking Window:</Text>
                    <Text style={styles.fieldValue}>{item["Drinking Window"]}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Tasting Notes */}
          {item["Tasting Notes"] && (
            <View style={styles.tastingNotesBox}>
              <Text style={styles.tastingNotesText}>
                {truncateWithBreaks(item["Tasting Notes"], 900, 90)}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.priceText}>
                {formatPrice(item["Selling Price"], item["Discount (%)"])}
              </Text>
              {showQuantity && item["Ordered Quantity"] && item["Ordered Quantity"] > 1 && (
                <Text style={styles.quantityText}>
                  {item["Ordered Quantity"]} - Requested
                </Text>
              )}
            </View>

            {item["Parker Points"] && (
              <Text style={styles.parkerPoints}>
                {item["Parker Points"]} - The Wine Advocate
              </Text>
            )}

            <Text style={styles.abvText}>{formatABV(item.ABV)}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};
