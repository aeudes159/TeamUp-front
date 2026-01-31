import { useState } from 'react';
import { View, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, IconButton, Surface } from 'react-native-paper';

type CreatePollModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreatePoll: (title: string, description?: string) => void;
  isLoading?: boolean;
};

export function CreatePollModal({
  visible,
  onClose,
  onCreatePoll,
  isLoading = false,
}: Readonly<CreatePollModalProps>) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreatePoll(title.trim(), description.trim() || undefined);
    setTitle('');
    setDescription('');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
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
            <View style={styles.header}>
              <Text variant="titleLarge" style={styles.title}>
                Create Poll
              </Text>
              <IconButton icon="close" onPress={handleClose} />
            </View>

            <Text variant="bodyMedium" style={styles.subtitle}>
              Create a poll to let your group vote on locations
            </Text>

            <TextInput
              label="Poll Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              placeholder="Where should we go?"
              maxLength={255}
            />

            <TextInput
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              placeholder="Add more details about this poll..."
              multiline
              numberOfLines={3}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleClose}
                style={styles.cancelButton}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.createButton}
                disabled={!title.trim() || isLoading}
                loading={isLoading}
              >
                Create Poll
              </Button>
            </View>
          </Surface>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    borderColor: '#d1d5db',
  },
  createButton: {
    backgroundColor: '#6366f1',
  },
});
