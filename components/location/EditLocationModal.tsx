import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Text, TextInput, Button, IconButton, Surface } from 'react-native-paper';
import { ImageIcon } from 'lucide-react-native';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { Location, NewLocation } from '@/types';

type EditLocationModalProps = {
  visible: boolean;
  onClose: () => void;
  onUpdateLocation: (locationId: number, updates: Partial<NewLocation>) => void;
  isLoading?: boolean;
  location: Location | null;
};

export function EditLocationModal({
  visible,
  onClose,
  onUpdateLocation,
  isLoading = false,
  location,
}: Readonly<EditLocationModalProps>) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const { pickImage, takePhoto, uploadImage, isUploading } = useImageUpload();

  // Initialize form with existing location data
  useEffect(() => {
    if (location) {
      setName(location.name || '');
      setAddress(location.address || '');
      setAveragePrice(location.averagePrice !== null ? String(location.averagePrice) : '');
      setPictureUrl(location.pictureUrl || null);
    }
  }, [location]);

  const handleSubmit = () => {
    if (!location?.id) return;
    if (!name.trim()) return;

    const priceValue = averagePrice.trim() ? parseFloat(averagePrice) : undefined;

    onUpdateLocation(location.id, {
      name: name.trim(),
      address: address.trim() || undefined,
      averagePrice: priceValue && !isNaN(priceValue) ? priceValue : undefined,
      pictureUrl: pictureUrl || undefined,
    });
    // Don't call handleClose() here - let the parent close the modal on success
  };

  const handleClose = () => {
    setName('');
    setAddress('');
    setAveragePrice('');
    setPictureUrl(null);
    onClose();
  };

  const handlePickImage = async () => {
    setShowImageOptions(false);
    const result = await pickImage();

    if (!result.canceled && result.assets?.[0]) {
      const publicUrl = await uploadImage(result.assets[0].uri);
      if (publicUrl) {
        setPictureUrl(publicUrl);
      }
    }
  };

  const handleTakePhoto = async () => {
    setShowImageOptions(false);
    const result = await takePhoto();

    if (!result.canceled && result.assets?.[0]) {
      const publicUrl = await uploadImage(result.assets[0].uri);
      if (publicUrl) {
        setPictureUrl(publicUrl);
      }
    }
  };

  const handleRemoveImage = () => {
    setPictureUrl(null);
  };

  const canSubmit = name.trim() && !isLoading && !isUploading;

  if (!location) return null;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalOverlay}>
            <Surface style={styles.modalContent} elevation={5}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                  <Text variant="titleLarge" style={styles.title}>
                    Modifier le lieu
                  </Text>
                  <IconButton icon="close" onPress={handleClose} />
                </View>

                <Text variant="bodyMedium" style={styles.subtitle}>
                  Mettez à jour les informations du lieu
                </Text>

                {/* Name Input */}
                <TextInput
                  label="Nom du lieu *"
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  style={styles.input}
                  placeholder="Ex: Restaurant Le Petit Bistro"
                  maxLength={255}
                />

                {/* Address Input */}
                <TextInput
                  label="Adresse"
                  value={address}
                  onChangeText={setAddress}
                  mode="outlined"
                  style={styles.input}
                  placeholder="Ex: 123 Rue de Paris, 75001 Paris"
                  multiline
                  numberOfLines={2}
                />

                {/* Average Price Input */}
                <TextInput
                  label="Prix moyen (€)"
                  value={averagePrice}
                  onChangeText={setAveragePrice}
                  mode="outlined"
                  style={styles.input}
                  placeholder="Ex: 25"
                  keyboardType="decimal-pad"
                  right={<TextInput.Affix text="€" />}
                />

                {/* Image Preview */}
                {pictureUrl && (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: pictureUrl }} style={styles.imagePreview} />
                    <IconButton
                      icon="close-circle"
                      size={24}
                      iconColor="#ffffff"
                      style={styles.removeImageButton}
                      onPress={handleRemoveImage}
                    />
                  </View>
                )}

                {/* Add Photo Button */}
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={() => setShowImageOptions(true)}
                  disabled={isUploading}
                >
                  <ImageIcon size={20} color={isUploading ? '#9ca3af' : '#6366f1'} />
                  <Text style={[styles.addPhotoText, isUploading && styles.addPhotoTextDisabled]}>
                    {isUploading ? 'Upload en cours...' : pictureUrl ? 'Changer la photo' : 'Ajouter une photo'}
                  </Text>
                </TouchableOpacity>

                {/* Submit Buttons */}
                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={handleClose}
                    style={styles.cancelButton}
                    disabled={isLoading || isUploading}
                  >
                    Annuler
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.updateButton}
                    disabled={!canSubmit}
                    loading={isLoading}
                  >
                    Mettre à jour
                  </Button>
                </View>
              </ScrollView>
            </Surface>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowImageOptions(false)}
      >
        <TouchableOpacity
          style={styles.imageOptionsOverlay}
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}
        >
          <View style={styles.imageOptionsContainer}>
            <TouchableOpacity style={styles.imageOption} onPress={handlePickImage}>
              <IconButton icon="image-multiple" size={24} />
              <Text style={styles.imageOptionText}>Choisir depuis la galerie</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.imageOption} onPress={handleTakePhoto}>
              <IconButton icon="camera" size={24} />
              <Text style={styles.imageOptionText}>Prendre une photo</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.cancelOption}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 0,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 20,
  },
  addPhotoText: {
    color: '#6366f1',
    fontWeight: '500',
  },
  addPhotoTextDisabled: {
    color: '#9ca3af',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    borderColor: '#d1d5db',
  },
  updateButton: {
    backgroundColor: '#6366f1',
  },
  imageOptionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  imageOptionsContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    paddingBottom: 32,
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  imageOptionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  cancelOption: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#ef4444',
  },
});
