import { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { IconButton, ActivityIndicator } from 'react-native-paper';

type CommentInputProps = {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
};

export function CommentInput({
  onSubmit,
  isLoading = false,
  placeholder = 'Write a comment...',
}: Readonly<CommentInputProps>) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const trimmedContent = content.trim();
    if (trimmedContent && !isLoading) {
      onSubmit(trimmedContent);
      setContent('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        
        {isLoading ? (
          <ActivityIndicator size={24} color="#6366f1" style={styles.loader} />
        ) : (
          <IconButton
            icon="send"
            size={24}
            iconColor={content.trim() ? '#6366f1' : '#d1d5db'}
            onPress={handleSubmit}
            disabled={!content.trim()}
            style={styles.sendButton}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    fontSize: 15,
    color: '#1f2937',
  },
  sendButton: {
    marginLeft: 4,
  },
  loader: {
    marginLeft: 4,
    marginRight: 12,
  },
});
