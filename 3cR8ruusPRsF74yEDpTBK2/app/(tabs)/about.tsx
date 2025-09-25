
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialIcons name="info" size={32} color="#007AFF" />
        <Text style={styles.title}>About Matchday Report</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Version:</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Purpose:</Text>
          <Text style={styles.value}>Venue management tool</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Year:</Text>
          <Text style={styles.value}>2025</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Author:</Text>
          <Text style={styles.value}>Maxim Ponomarev</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Company:</Text>
          <Text style={styles.value}>Supreme Committee</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureItem}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>Create comprehensive match reports</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>Track 35 functional areas</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>Attach photos to reports</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>Generate and share PDF reports</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>Local data storage</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openLink('mailto:m.ponomarev@loc.qa')}
        >
          <MaterialIcons name="email" size={24} color="#007AFF" />
          <Text style={styles.contactText}>m.ponomarev@loc.qa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openLink('tel:+97474481142')}
        >
          <MaterialIcons name="phone" size={24} color="#007AFF" />
          <Text style={styles.contactText}>+974 7448 1142</Text>
        </TouchableOpacity>
      </View> {/* Corrected: Changed </div> to </View> */}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 Supreme Committee for Delivery & Legacy
        </Text>
        <Text style={styles.footerSubtext}>
          All rights reserved
        </Text>
      </View>

      <View style={{ height: insets.bottom + 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 12,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
