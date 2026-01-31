import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

export type ImageUploadResult = {
  uri: string;
  publicUrl: string;
};

export type UseImageUploadReturn = {
  uploadImage: (uri: string) => Promise<string | null>;
  pickImage: () => Promise<ImagePicker.ImagePickerResult>;
  takePhoto: () => Promise<ImagePicker.ImagePickerResult>;
  isUploading: boolean;
  error: string | null;
};

/**
 * Hook for handling image selection and upload to Supabase Storage
 */
export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Pick an image from the device gallery
   */
  const pickImage = async (): Promise<ImagePicker.ImagePickerResult> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      setError('Permission to access gallery was denied');
      return { canceled: true, assets: null };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    return result;
  };

  /**
   * Take a photo with the camera
   */
  const takePhoto = async (): Promise<ImagePicker.ImagePickerResult> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      setError('Permission to access camera was denied');
      return { canceled: true, assets: null };
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    return result;
  };

  /**
   * Upload an image to Supabase Storage
   */
  const uploadImage = async (uri: string): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Generate unique filename
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `chat-images/${fileName}`;

      // Fetch the image and convert to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Convert blob to ArrayBuffer for Supabase
      const arrayBuffer = await new Response(blob).arrayBuffer();

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setIsUploading(false);
      return urlData.publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
      setIsUploading(false);
      return null;
    }
  };

  return {
    uploadImage,
    pickImage,
    takePhoto,
    isUploading,
    error,
  };
}
