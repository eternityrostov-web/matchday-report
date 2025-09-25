import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { ReportPhoto } from '../types/report';

interface PhotoUploaderProps {
  photos: ReportPhoto[];
  onPhotosChange: (photos: ReportPhoto[]) => void;
  maxPhotos?: number;
}

export default function PhotoUploader({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 10 
}: PhotoUploaderProps) {

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to photo library to add images.'
        );
        return;
      }

      const remainingSlots = maxPhotos - photos.length;
      if (remainingSlots <= 0) {
        Alert.alert('Limit Reached', `You can only add up to ${maxPhotos} photos.`);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.7,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const newPhotos: ReportPhoto[] = result.assets.map(asset => ({
          id: Date.now().toString() + Math.random().toString(),
          uri: asset.uri,
          filename: asset.fileName || `photo_${Date.now()}.jpg`
        }));
        
        onPhotosChange([...photos, ...newPhotos]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow camera access to take photos.'
        );
        return;
      }

      if (photos.length >= maxPhotos) {
        Alert.alert('Limit Reached', `You can only add up to ${maxPhotos} photos.`);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto: ReportPhoto = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          filename: result.assets[0].fileName || `photo_${Date.now()}.jpg`
        };
        
        onPhotosChange([...photos, newPhoto]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removePhoto = (photoId: string) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            onPhotosChange(photos.filter(photo => photo.id !== photoId));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Photos ({photos.length}/{maxPhotos})</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.addPhotoButton}
          onPress={pickImages}
          disabled={photos.length >= maxPhotos}
        >
          <MaterialIcons name="add-a-photo" size={24} color="#007AFF" />
          <Text style={styles.addPhotoText}>
            Add Photos ({photos.length}/{maxPhotos})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cameraButton}
          onPress={takePhoto}
          disabled={photos.length >= maxPhotos}
        >
          <MaterialIcons name="camera-alt" size={24} color="#007AFF" />
          <Text style={styles.cameraText}>Take Photos</Text>
        </TouchableOpacity>
      </View>

      {photos.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.photosContainer}
          contentContainerStyle={styles.photosContent}
        >
          {photos.map((photo) => (
            <View key={photo.id} style={styles.photoItem}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.photo}
                contentFit="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(photo.id)}
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <Text style={styles.helperText}>
        Maximum {maxPhotos} photos allowed. Photos will be included in the PDF report.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  addPhotoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  addPhotoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  cameraButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  cameraText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  photosContainer: {
    marginVertical: 10,
  },
  photosContent: {
    paddingRight: 10,
  },
  photoItem: {
    position: 'relative',
    marginRight: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4444',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});