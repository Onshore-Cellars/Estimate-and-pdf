import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for A5 Landscape
const styles = StyleSheet.create({
  page: {
    width: 595.28, // A5 landscape width
    height: 419.53, // A5 landscape height
    backgroundColor: '#0A1E3E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginBottom: 60,
  },
  clientName: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#C8A882',
    marginBottom: 20,
    textAlign: 'center',
  },
  referenceNumber: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  wavePattern: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  wave: {
    fontSize: 24,
    color: '#C8A882',
  },
});

interface TitlePageProps {
  clientName: string;
  referenceNumber: string;
}

export const TitlePage: React.FC<TitlePageProps> = ({ 
  clientName, 
  referenceNumber 
}) => {
  return (
    <Page size={[595.28, 419.53]} style={styles.page}>
      <Text style={styles.logo}>ONSHORE CELLARS</Text>
      <Text style={styles.clientName}>{clientName}</Text>
      <Text style={styles.referenceNumber}>{referenceNumber}</Text>
      
      <View style={styles.wavePattern}>
        <Text style={styles.wave}>~ ~ ~ ~</Text>
      </View>
    </Page>
  );
};
