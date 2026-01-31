import { FlatList, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Appbar } from 'react-native-paper';
import { MessageBubble } from '@/components/groups/MessageBubble';
import { useMessages, useSendMessage } from '@/hooks/useMessages';
import { useGroup } from '@/hooks/useGroups';
import { useGroupDiscussions } from '@/hooks/useDiscussions';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';

// TODO: Replace with actual authenticated user ID
const CURRENT_USER_ID = 1;

export default function GroupChatScreen() {
    const { id } = useLocalSearchParams();
    const groupId = typeof id === 'string' ? parseInt(id, 10) : undefined;
    
    const [newMessage, setNewMessage] = useState('');
    const [discussionId, setDiscussionId] = useState<number | undefined>(undefined);

    // Fetch group details
    const { data: group, isLoading: groupLoading } = useGroup(groupId);
    
    // Fetch discussions for this group
    const { data: discussions, isLoading: discussionsLoading } = useGroupDiscussions(groupId);
    
    // Set the first discussion as the active one (or create one if none exists)
    useEffect(() => {
        if (discussions && discussions.length > 0 && discussions[0].id) {
            setDiscussionId(discussions[0].id);
        }
    }, [discussions]);

    // Fetch messages for the active discussion
    const { 
        data: messages, 
        isLoading: messagesLoading, 
        error: messagesError 
    } = useMessages(discussionId);
    
    // Send message mutation
    const sendMessageMutation = useSendMessage();

    const sendMessage = () => {
        if (!newMessage.trim() || !discussionId) return;

        sendMessageMutation.mutate({
            content: newMessage,
            senderId: CURRENT_USER_ID,
            discussionId: discussionId,
        }, {
            onSuccess: () => {
                setNewMessage('');
            },
        });
    };

    const isLoading = groupLoading || discussionsLoading;

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading chat...</Text>
            </View>
        );
    }

    if (!group) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Group not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!discussionId) {
        return (
            <View style={styles.errorContainer}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title={group.name} />
                </Appbar.Header>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No discussion found</Text>
                    <Text style={styles.emptyDetail}>This group has no active discussions</Text>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
            keyboardVerticalOffset={100}
        >
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content 
                        title={group.name} 
                        subtitle={group.isPublic ? 'Public Group' : 'Private Group'}
                    />
                </Appbar.Header>

                {messagesLoading && (
                    <View style={styles.messagesLoading}>
                        <ActivityIndicator size="small" />
                    </View>
                )}

                {messagesError && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>
                            Error loading messages. Will retry...
                        </Text>
                    </View>
                )}

                <FlatList
                    data={messages || []}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <MessageBubble
                            message={item}
                            isCurrentUser={item.senderId === CURRENT_USER_ID}
                        />
                    )}
                    contentContainerStyle={styles.messagesList}
                    inverted={false}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Your message..."
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                        editable={!sendMessageMutation.isPending}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        style={[
                            styles.sendButton,
                            (sendMessageMutation.isPending || !newMessage.trim()) && 
                                styles.sendButtonDisabled
                        ]}
                        disabled={sendMessageMutation.isPending || !newMessage.trim()}
                    >
                        {sendMessageMutation.isPending ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.sendButtonText}>Send</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#6b7280',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ef4444',
        textAlign: 'center',
        marginTop: 40,
    },
    backLink: {
        marginTop: 16,
        color: '#3b82f6',
        textDecorationLine: 'underline',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6b7280',
    },
    emptyDetail: {
        marginTop: 8,
        color: '#9ca3af',
    },
    messagesLoading: {
        padding: 8,
        alignItems: 'center',
    },
    errorBanner: {
        backgroundColor: '#fef2f2',
        padding: 8,
        alignItems: 'center',
    },
    errorBannerText: {
        color: '#ef4444',
        fontSize: 12,
    },
    messagesList: {
        paddingVertical: 16,
    },
    inputContainer: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 8,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    sendButtonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
});
