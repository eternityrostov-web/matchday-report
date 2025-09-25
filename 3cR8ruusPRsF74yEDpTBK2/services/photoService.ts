import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ReportPhoto } from '../types/report';

export class PhotoService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return cameraPermission.status === 'granted' && mediaPermission.status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  static async takePhoto(): Promise<ReportPhoto | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Camera permissions not granted');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          id: Date.now().toString(),
          uri: asset.uri,
          type: asset.type || 'image',
          name: `photo_${Date.now()}.jpg`
        };
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  static async pickFromGallery(): Promise<ReportPhoto | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permissions not granted');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          id: Date.now().toString(),
          uri: asset.uri,
          type: asset.type || 'image',
          name: asset.fileName || `photo_${Date.now()}.jpg`
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking from gallery:', error);
      throw error;
    }
  }

  static async savePhotoToDevice(photo: ReportPhoto): Promise<string> {
    try {
      const fileUri = `${FileSystem.documentDirectory}venue_photos/${photo.name}`;
      
      // Create directory if it doesn't exist
      const dirUri = `${FileSystem.documentDirectory}venue_photos/`;
      const dirInfo = await FileSystem.getInfoAsync(dirUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
      }

      // Copy file to app directory  
      await FileSystem.copyAsync({
        from: photo.uri,
        to: fileUri
      });

      return fileUri;
    } catch (error) {
      console.error('Error saving photo:', error);
      throw error;
    }
  }

  static async deletePhoto(photoPath: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(photoPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(photoPath);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  }
}