import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  StyleSheet 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FunctionalArea } from '../types/report';

interface FunctionalAreaItemProps {
  area: FunctionalArea;
  onStatusChange: (code: string, status: 'OK' | 'ISSUE') => void;
  onCommentChange: (code: string, comment: string) => void;
}

export default function FunctionalAreaItem({ 
  area, 
  onStatusChange, 
  onCommentChange 
}: FunctionalAreaItemProps) {
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.codeContainer}>
          <Text style={styles.code}>{area.code}</Text>
        </View>
        
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{area.name}</Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.statusButton, 
            area.status === 'ISSUE' && styles.statusButtonActive
          ]}
          onPress={() => onStatusChange(area.code, area.status === 'ISSUE' ? 'OK' : 'ISSUE')}
        >
          <MaterialIcons 
            name={area.status === 'ISSUE' ? 'warning' : 'check-circle'} 
            size={20} 
            color={area.status === 'ISSUE' ? '#ff6b35' : '#4CAF50'} 
          />
          <Text style={[
            styles.statusText,
            area.status === 'ISSUE' && styles.statusTextActive
          ]}>
            {area.status === 'ISSUE' ? 'Issue' : 'OK'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {area.status === 'ISSUE' && (
        <View style={styles.commentSection}>
          <TextInput
            style={styles.commentInput}
            value={area.comment}
            onChangeText={(text) => onCommentChange(area.code, text)}
            placeholder="Describe the issue..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
  },
  codeContainer: {
    width: 60,
    marginRight: 10,
  },
  code: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  nameContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
    justifyContent: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 5,
  },
  statusTextActive: {
    color: '#ff6b35',
  },
  commentSection: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  commentInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 60,
  },
});

// Helper styles for enhanced UI
const enhancedStyles = StyleSheet.create({
  // Animation styles (for future enhancement)
  animatedContainer: {
    transform: [{ scale: 1 }],
  },
  
  // Accessibility styles
  accessibilityFocus: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  
  // Dark mode styles (for future enhancement)
  darkModeContainer: {
    backgroundColor: '#2c2c2e',
  },
  darkModeText: {
    color: '#ffffff',
  },
  
  // High contrast styles (for accessibility)
  highContrastButton: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  
  // Large text styles (for accessibility)
  largeText: {
    fontSize: 18,
  },
  
  // Compact layout styles
  compactContainer: {
    paddingVertical: 8,
  },
  compactHeader: {
    paddingVertical: 10,
  },
  
  // Loading state styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Error state styles
  errorBorder: {
    borderColor: '#ff3b30',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff3b30',
  },
  
  // Success state styles
  successBorder: {
    borderColor: '#30d158',
    borderWidth: 1,
  },
  successText: {
    color: '#30d158',
  },
  
  // Disabled state styles
  disabledContainer: {
    opacity: 0.6,
  },
  disabledButton: {
    backgroundColor: '#f2f2f2',
  },
  disabledText: {
    color: '#8e8e93',
  },
});