import { View, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { useState } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';

type ImagePickerButtonProps = {
  onImageSelected: (imageUrl: string) => void;
  disabled?: boolean;
};

export function ImagePickerButton({ onImageSelected, disabled }: Readonly<ImagePickerButtonProps>) {
  const [showOptions, setShowOptions] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const { pickImage, takePhoto, uploadImage, isUploading, error } = useImageUpload();

  const handlePickImage = async () => {
    setShowOptions(false);
    const result = await pickImage();

    if (!result.canceled && result.assets?.[0]) {
      setPreviewUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    setShowOptions(false);
    const result = await takePhoto();

    if (!result.canceled && result.assets?.[0]) {
      setPreviewUri(result.assets[0].uri);
    }
  };

  const handleConfirmUpload = async () => {
    if (!previewUri) return;

    const publicUrl = await uploadImage(previewUri);
    if (publicUrl) {
      onImageSelected(publicUrl);
      setPreviewUri(null);
    }
  };

  const handleCancelPreview = () => {
    setPreviewUri(null);
  };

  return (
    <>
      <IconButton
        icon="image"
        size={24}
        onPress={() => setShowOptions(true)}
        disabled={disabled || isUploading}
        style={styles.button}
      />

      {/* Options modal */}
      <Modal
        visible={showOptions}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={handlePickImage}
            >
              <IconButton icon="image-multiple" size={24} />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.option}
              onPress={handleTakePhoto}
            >
              <IconButton icon="camera" size={24} />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.cancelOption}
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Preview modal */}
      <Modal
        visible={!!previewUri}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelPreview}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview</Text>

            {previewUri && (
              <Image
                source={{ uri: previewUri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelPreview}
                disabled={isUploading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sendButton, isUploading && styles.sendButtonDisabled]}
                onPress={handleConfirmUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.sendButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    paddingBottom: 32,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  optionText: {
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
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 8,
    textAlign: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  sendButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});
