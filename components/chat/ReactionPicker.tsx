import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useState, useRef, useEffect } from 'react';

// Quick select emojis
const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

// Full emoji list by category
const EMOJI_CATEGORIES: Record<string, string[]> = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'],
  'Gestures': ['👋', '🤚', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '👀', '👅', '👄'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌', '💋'],
  'Celebrations': ['🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🍰', '🧁', '🥂', '🍾', '🎇', '🎆', '✨', '🌟', '⭐', '💫', '🏆', '🥇', '🥈', '🥉', '🏅'],
};

type ReactionPickerProps = {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
  position?: { x: number; y: number };
};

export function ReactionPicker({ onSelectEmoji, onClose }: Readonly<ReactionPickerProps>) {
  const [showFullPicker, setShowFullPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Smileys');
  const { height: windowHeight } = useWindowDimensions();

  const handleQuickSelect = (emoji: string) => {
    onSelectEmoji(emoji);
  };

  const handleFullSelect = (emoji: string) => {
    onSelectEmoji(emoji);
    setShowFullPicker(false);
  };

  const handleClose = () => {
    setShowFullPicker(false);
    onClose();
  };

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        {!showFullPicker ? (
          // Quick emoji picker - centered
          <Pressable
            style={styles.quickPickerContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.quickPicker}>
              <View style={styles.quickEmojis}>
                {QUICK_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => handleQuickSelect(emoji)}
                    style={styles.emojiButton}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setShowFullPicker(true)}
                  style={styles.moreButton}
                >
                  <Text style={styles.moreIcon}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        ) : (
          // Full emoji picker - bottom sheet
          <Pressable
            style={styles.fullPickerContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowFullPicker(false)}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Choose Reaction</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={handleClose}
              />
            </View>

            {/* Category tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryTabs}
            >
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.categoryTab,
                    selectedCategory === category && styles.categoryTabActive
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      selectedCategory === category && styles.categoryTabTextActive
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Emoji grid */}
            <ScrollView style={styles.emojiGrid}>
              <View style={styles.emojiGridContent}>
                {EMOJI_CATEGORIES[selectedCategory].map((emoji, index) => (
                  <TouchableOpacity
                    key={`${emoji}-${index}`}
                    onPress={() => handleFullSelect(emoji)}
                    style={styles.gridEmojiButton}
                  >
                    <Text style={styles.gridEmoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickPickerContainer: {
    width: '85%',
    maxWidth: 350,
  },
  quickPicker: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  quickEmojis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  emojiButton: {
    padding: 8,
  },
  emoji: {
    fontSize: 26,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    fontSize: 20,
    color: '#6b7280',
  },
  fullPickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backText: {
    fontSize: 16,
    color: '#6366f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoryTabs: {
    maxHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryTabTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  emojiGrid: {
    padding: 8,
    maxHeight: 280,
  },
  emojiGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridEmojiButton: {
    width: '12.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridEmoji: {
    fontSize: 28,
  },
});
