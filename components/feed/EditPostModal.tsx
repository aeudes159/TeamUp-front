import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, TextInput, Button, IconButton, Surface } from 'react-native-paper';
import { MapPin, ImageIcon } from 'lucide-react-native';
import { LocationSearchDrawer } from '@/components/poll/LocationSearchDrawer';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { Location, Post } from '@/types';

type EditPostModalProps = {
  visible: boolean;
  onClose: () => void;
  onUpdatePost: (postId: number, updates: { content?: string; imageUrl?: string; locationId?: number }) => void;
  isLoading?: boolean;
  post: Post | null;
  location?: Location | null;
};

export function EditPostModal({
  visible,
  onClose,
  onUpdatePost,
  isLoading = false,
  post,
  location,
}: Readonly<EditPostModalProps>) {
  const [content, setContent] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const { pickImage, takePhoto, uploadImage, isUploading } = useImageUpload();

  // Initialize form with existing post data
  useEffect(() => {
    if (post) {
      setContent(post.content || '');
      setImageUrl(post.imageUrl || null);
      setSelectedLocation(location || null);
    }
  }, [post, location]);

  const handleSubmit = () => {
    if (!post?.id) return;
    if (!content.trim() && !imageUrl) return;

    onUpdatePost(post.id, {
      content: content.trim() || undefined,
      imageUrl: imageUrl || undefined,
      locationId: selectedLocation?.id ?? undefined,
    });
    // Don't call handleClose() here - let the parent close the modal on success
  };

  const handleClose = () => {
    setContent('');
    setSelectedLocation(null);
    setImageUrl(null);
    onClose();
  };

  const handleSelectLocation = (loc: Location) => {
    setSelectedLocation(loc);
  };

  const handleRemoveLocation = () => {
    setSelectedLocation(null);
  };

  const handlePickImage = async () => {
    setShowImageOptions(false);
    const result = await pickImage();

    if (!result.canceled && result.assets?.[0]) {
      const publicUrl = await uploadImage(result.assets[0].uri);
      if (publicUrl) {
        setImageUrl(publicUrl);
      }
    }
  };

  const handleTakePhoto = async () => {
    setShowImageOptions(false);
    const result = await takePhoto();

    if (!result.canceled && result.assets?.[0]) {
      const publicUrl = await uploadImage(result.assets[0].uri);
      if (publicUrl) {
        setImageUrl(publicUrl);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  const canSubmit = (content.trim() || imageUrl) && !isLoading && !isUploading;

  if (!post) return null;

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
              {/* Header */}
              <View style={styles.header}>
                <Text variant="titleLarge" style={styles.title}>
                  Edit Post
                </Text>
                <IconButton icon="close" onPress={handleClose} />
              </View>

              <Text variant="bodyMedium" style={styles.subtitle}>
                Update your post
              </Text>

              {/* Content Input */}
              <TextInput
                label="What's on your mind?"
                value={content}
                onChangeText={setContent}
                mode="outlined"
                style={styles.input}
                placeholder="Write something..."
                multiline
                numberOfLines={4}
              />

              {/* Image Preview */}
              {imageUrl && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                  <IconButton
                    icon="close-circle"
                    size={24}
                    iconColor="#ffffff"
                    style={styles.removeImageButton}
                    onPress={handleRemoveImage}
                  />
                </View>
              )}

              {/* Selected Location */}
              {selectedLocation && (
                <View style={styles.selectedLocationContainer}>
                  <View style={styles.selectedLocationContent}>
                    <MapPin size={16} color="#6366f1" />
                    <Text variant="bodyMedium" style={styles.selectedLocationText}>
                      {selectedLocation.name || selectedLocation.address}
                    </Text>
                  </View>
                  <IconButton
                    icon="close-circle"
                    size={20}
                    onPress={handleRemoveLocation}
                  />
                </View>
              )}

              {/* Action Buttons Row */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowImageOptions(true)}
                  disabled={isUploading}
                >
                  <ImageIcon size={20} color={isUploading ? '#9ca3af' : '#6366f1'} />
                  <Text style={[styles.actionButtonText, isUploading && styles.actionButtonTextDisabled]}>
                    {isUploading ? 'Uploading...' : imageUrl ? 'Change Photo' : 'Add Photo'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowLocationDrawer(true)}
                >
                  <MapPin size={20} color="#6366f1" />
                  <Text style={styles.actionButtonText}>
                    {selectedLocation ? 'Change Location' : 'Add Location'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Submit Buttons */}
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={handleClose}
                  style={styles.cancelButton}
                  disabled={isLoading || isUploading}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.updateButton}
                  disabled={!canSubmit}
                  loading={isLoading}
                >
                  Update
                </Button>
              </View>
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
              <Text style={styles.imageOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.imageOption} onPress={handleTakePhoto}>
              <IconButton icon="camera" size={24} />
              <Text style={styles.imageOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.cancelOption}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Location Search Drawer */}
      <LocationSearchDrawer
        visible={showLocationDrawer}
        onClose={() => setShowLocationDrawer(false)}
        onSelectLocation={handleSelectLocation}
        title="Change Location"
      />
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
  selectedLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 16,
  },
  selectedLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  selectedLocationText: {
    color: '#6366f1',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#6366f1',
    fontWeight: '500',
  },
  actionButtonTextDisabled: {
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
