import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Text, Card, Button, Portal, Modal as PaperModal } from 'react-native-paper';
import { Users, Check } from 'lucide-react-native';
import { useGroups } from '@/hooks/useGroups';
import { useSendMessage } from '@/hooks/useMessages';
import type { Post, Group, GroupResponse, DiscussionListResponse } from '@/types';

type GroupSelectorProps = {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
  authorName?: string;
  locationName?: string;
};

export function GroupSelector({ visible, post, onClose, authorName, locationName }: GroupSelectorProps) {
  const { data: groupsData } = useGroups({ page: 0, size: 50 });
  const sendMessageMutation = useSendMessage();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);

  const groups = groupsData?.data || [];

  const handleGroupSelect = async (group: GroupResponse) => {
    if (!post || !group.id) return;
    
    setIsSending(true);
    setSelectedGroupId(group.id);
    
    try {
      // Get discussion for this group using API call directly
      const { apiGet } = await import('@/lib/api');
      
      const discussionsResponse = await apiGet<DiscussionListResponse>(
        `/api/discussions/by-group/${group.id}?page=0&size=20`
      );
      
      if (discussionsResponse?.data && discussionsResponse.data.length > 0) {
        const discussion = discussionsResponse.data[0];
        
        // Create activity message
        const messageContent = createActivityMessage(post, authorName, locationName);
        
        await sendMessageMutation.mutateAsync({
          content: messageContent,
          senderId: 1, // TODO: Use current user ID
          discussionId: discussion.id!,
        });
        
        // Close modal after successful send
        setTimeout(() => {
          onClose();
          setSelectedGroupId(null);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to send activity proposal:', error);
    } finally {
      setIsSending(false);
    }
  };

  const createActivityMessage = (post: Post, author?: string, location?: string): string => {
    const activityTitle = post.content || 'Activité intéressante';
    let message = `🎯 Proposition d'activité\n\n`;
    message += `**${activityTitle}**\n`;
    
    if (author) {
      message += `Publié par: ${author}\n`;
    }
    
    if (location) {
      message += `Lieu: ${location}\n`;
    }
    
    if (post.imageUrl) {
      message += `[Image de l'activité]\n`;
    }
    
    message += `\nIntéressé(e) par cette activité ? 🙋`;
    
    return message;
  };

  const handleClose = () => {
    if (!isSending) {
      onClose();
      setSelectedGroupId(null);
    }
  };

  return (
    <Portal>
      <PaperModal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Proposer cette activité
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Choisissez un groupe où partager cette activité
          </Text>
        </View>

        <FlatList
          data={groups}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          style={styles.groupsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleGroupSelect(item)}
              disabled={isSending || selectedGroupId === item.id}
              style={styles.groupItem}
            >
              <Card style={[styles.groupCard, selectedGroupId === item.id && styles.selectedCard]}>
                <Card.Content style={styles.groupContent}>
                  <View style={styles.groupInfo}>
                    <Users size={20} color="#6366f1" />
                    <View style={styles.groupDetails}>
                      <Text variant="titleSmall" style={styles.groupName}>
                        {item.name}
                      </Text>
                      <Text variant="bodySmall" style={styles.groupType}>
                        {item.isPublic ? 'Groupe public' : 'Groupe privé'}
                      </Text>
                    </View>
                  </View>
                  {selectedGroupId === item.id && (
                    <Check size={20} color="#10b981" />
                  )}
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleClose}
            disabled={isSending}
            style={styles.cancelButton}
          >
            Annuler
          </Button>
        </View>
      </PaperModal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
  },
  groupsList: {
    flex: 1,
    marginBottom: 16,
  },
  groupItem: {
    marginBottom: 8,
  },
  groupCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCard: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  groupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupDetails: {
    marginLeft: 12,
    flex: 1,
  },
  groupName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  groupType: {
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
});