import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for A4 Portrait
const styles = StyleSheet.create({
  page: {
    width: 595.28, // A4 width
    height: 841.89, // A4 height
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0A1E3E',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 14,
    color: '#666666',
  },
  categoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    color: '#0A1E3E',
    textAlign: 'center',
  },
  wavePattern: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  wave: {
    fontSize: 24,
    color: '#C8A882',
  },
});

interface SeparatorPageProps {
  clientName: string;
  categoryDetail: string;
}

export const SeparatorPage: React.FC<SeparatorPageProps> = ({ 
  clientName, 
  categoryDetail 
}) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>ONSHORE CELLARS</Text>
        <Text style={styles.clientName}>{clientName}</Text>
      </View>
      
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{categoryDetail}</Text>
      </View>
      
      <View style={styles.wavePattern}>
        <Text style={styles.wave}>~ ~ ~ ~ ~ ~</Text>
      </View>
    </Page>
  );
};
