import { FlatList, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import { Text, ActivityIndicator, Appbar } from 'react-native-paper';
import { MessageBubble } from '@/components/groups/MessageBubble';
import { PollCard, CreatePollModal, LocationSearchDrawer } from '@/components/poll';
import { useMessages, useSendMessage } from '@/hooks/useMessages';
import { useGroup } from '@/hooks/useGroups';
import { useGroupDiscussions } from '@/hooks/useDiscussions';
import { useReactions, useAddReaction, useRemoveReaction } from '@/hooks/useReactions';
import { usePolls, useCreatePoll, useVote, useRemoveVote, useAddPollOption, useClosePoll } from '@/hooks/usePolls';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ImagePickerButton } from '@/components/chat/ImagePickerButton';
import type { Message, Reaction, Location, Poll } from '@/types';

// TODO: Replace with actual authenticated user ID
const CURRENT_USER_ID = 1;

// Poll interval reduced to 2 seconds for more responsive updates
const MESSAGE_POLL_INTERVAL = 2000;

// Poll card width for carousel
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const POLL_CARD_WIDTH = SCREEN_WIDTH * 0.85;

export default function GroupChatScreen() {
    const { id } = useLocalSearchParams();
    const groupId = typeof id === 'string' ? parseInt(id, 10) : undefined;

    const [newMessage, setNewMessage] = useState('');
    const [discussionId, setDiscussionId] = useState<number | undefined>(undefined);
    const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [messageReactions, setMessageReactions] = useState<Map<number, Reaction[]>>(new Map());
    const flatListRef = useRef<FlatList>(null);

    // Poll-related state
    const [showCreatePoll, setShowCreatePoll] = useState(false);
    const [showLocationSearch, setShowLocationSearch] = useState(false);
    const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
    const [showPolls, setShowPolls] = useState(true);

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

    // Fetch messages for the active discussion with 2s polling
    const {
        data: messagesData,
        isLoading: messagesLoading,
        error: messagesError
    } = useMessages(discussionId, { page: 0, size: 50 }, true);

    // Fetch polls for the active discussion
    const {
        data: pollsData,
        isLoading: pollsLoading,
    } = usePolls(discussionId, { page: 0, size: 20 }, true);

    // Reverse messages so oldest appear first (at top), newest at bottom
    const messages = useMemo(() => {
        if (!messagesData) return [];
        return [...messagesData].reverse();
    }, [messagesData]);

    // Send message mutation
    const sendMessageMutation = useSendMessage();

    // Reaction mutations
    const addReactionMutation = useAddReaction();
    const removeReactionMutation = useRemoveReaction();

    // Poll mutations
    const createPollMutation = useCreatePoll();
    const voteMutation = useVote();
    const removeVoteMutation = useRemoveVote();
    const addPollOptionMutation = useAddPollOption();
    const closePollMutation = useClosePoll();

    // Function to fetch reactions for a single message
    const fetchReactionsForMessage = useCallback(async (messageId: number) => {
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/reactions/by-message/${messageId}?page=0&size=50`
            );
            if (response.ok) {
                const data = await response.json();
                setMessageReactions(prev => {
                    const next = new Map(prev);
                    next.set(messageId, data.data || []);
                    return next;
                });
            }
        } catch (error) {
            // Silently fail
        }
    }, []);

    // Fetch reactions for all messages
    useEffect(() => {
        if (!messagesData || messagesData.length === 0) return;

        const fetchAllReactions = async () => {
            const newReactionsMap = new Map<number, Reaction[]>();

            for (const message of messagesData) {
                if (message.id) {
                    try {
                        const response = await fetch(
                            `${process.env.EXPO_PUBLIC_API_URL}/api/reactions/by-message/${message.id}?page=0&size=50`
                        );
                        if (response.ok) {
                            const data = await response.json();
                            newReactionsMap.set(message.id, data.data || []);
                        }
                    } catch (error) {
                        // Silently fail for individual message reactions
                    }
                }
            }

            setMessageReactions(newReactionsMap);
        };

        fetchAllReactions();
    }, [messagesData]);

    const sendMessage = (imageUrl?: string) => {
        if ((!newMessage.trim() && !imageUrl) || !discussionId) return;

        sendMessageMutation.mutate({
            content: newMessage.trim() || undefined,
            imageUrl: imageUrl,
            senderId: CURRENT_USER_ID,
            discussionId: discussionId,
        }, {
            onSuccess: () => {
                setNewMessage('');
                // Scroll to bottom after sending
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            },
        });
    };

    const handleImageSelected = (imageUrl: string) => {
        sendMessage(imageUrl);
    };

    const handleLongPress = useCallback((messageId: number) => {
        setSelectedMessageId(messageId);
        setShowReactionPicker(true);
    }, []);

    const handleSelectEmoji = useCallback(async (emoji: string) => {
        if (!selectedMessageId) return;

        const existingReactions = messageReactions.get(selectedMessageId) || [];
        const userReaction = existingReactions.find(
            r => r.userId === CURRENT_USER_ID && r.emoji === emoji
        );

        const messageIdToUpdate = selectedMessageId;

        if (userReaction && userReaction.id) {
            // Remove existing reaction
            removeReactionMutation.mutate({
                id: userReaction.id,
                messageId: selectedMessageId
            }, {
                onSuccess: () => fetchReactionsForMessage(messageIdToUpdate)
            });
        } else {
            // Add new reaction
            addReactionMutation.mutate({
                emoji,
                userId: CURRENT_USER_ID,
                messageId: selectedMessageId
            }, {
                onSuccess: () => fetchReactionsForMessage(messageIdToUpdate)
            });
        }

        setShowReactionPicker(false);
        setSelectedMessageId(null);
    }, [selectedMessageId, messageReactions, addReactionMutation, removeReactionMutation, fetchReactionsForMessage]);

    const handleReactionPress = useCallback((messageId: number, emoji: string) => {
        const existingReactions = messageReactions.get(messageId) || [];
        const userReaction = existingReactions.find(
            r => r.userId === CURRENT_USER_ID && r.emoji === emoji
        );

        if (userReaction && userReaction.id) {
            // Remove existing reaction
            removeReactionMutation.mutate({
                id: userReaction.id,
                messageId: messageId
            }, {
                onSuccess: () => fetchReactionsForMessage(messageId)
            });
        } else {
            // Add new reaction
            addReactionMutation.mutate({
                emoji,
                userId: CURRENT_USER_ID,
                messageId: messageId
            }, {
                onSuccess: () => fetchReactionsForMessage(messageId)
            });
        }
    }, [messageReactions, addReactionMutation, removeReactionMutation, fetchReactionsForMessage]);

    // Poll handlers
    const handleCreatePoll = useCallback((title: string, description?: string) => {
        if (!discussionId) return;

        createPollMutation.mutate({
            title,
            description,
            discussionId,
            creatorId: CURRENT_USER_ID,
        }, {
            onSuccess: () => {
                setShowCreatePoll(false);
            },
        });
    }, [discussionId, createPollMutation]);

    const handleVote = useCallback((optionId: number) => {
        voteMutation.mutate({
            pollOptionId: optionId,
            userId: CURRENT_USER_ID,
        });
    }, [voteMutation]);

    const handleRemoveVote = useCallback((optionId: number) => {
        removeVoteMutation.mutate({
            optionId,
            userId: CURRENT_USER_ID,
        });
    }, [removeVoteMutation]);

    const handleAddOption = useCallback((pollId: number) => {
        setSelectedPollId(pollId);
        setShowLocationSearch(true);
    }, []);

    const handleSelectLocation = useCallback((location: Location) => {
        if (!selectedPollId || !location.id) return;

        addPollOptionMutation.mutate({
            pollId: selectedPollId,
            locationId: location.id,
            addedByUserId: CURRENT_USER_ID,
        }, {
            onSuccess: () => {
                setShowLocationSearch(false);
                setSelectedPollId(null);
            },
        });
    }, [selectedPollId, addPollOptionMutation]);

    const handleClosePoll = useCallback((pollId: number) => {
        closePollMutation.mutate({
            id: pollId,
            userId: CURRENT_USER_ID,
        });
    }, [closePollMutation]);

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
                    <Appbar.Action
                        icon="plus-circle-outline"
                        onPress={() => setShowCreatePoll(true)}
                    />
                    <Appbar.Action
                        icon={showPolls ? 'poll' : 'poll'}
                        onPress={() => setShowPolls(!showPolls)}
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

                {/* Polls Carousel */}
                {showPolls && pollsData && pollsData.length > 0 && (
                    <View style={styles.pollsSection}>
                        <View style={styles.pollsHeader}>
                            <Text variant="titleSmall" style={styles.pollsTitle}>
                                Active Polls ({pollsData.length})
                            </Text>
                        </View>
                        <FlatList
                            data={pollsData}
                            keyExtractor={(item) => String(item.id)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={POLL_CARD_WIDTH + 16}
                            snapToAlignment="start"
                            decelerationRate="fast"
                            contentContainerStyle={styles.pollsScrollContent}
                            renderItem={({ item: poll }) => (
                                <View style={styles.pollCardWrapper}>
                                    <PollCard
                                        poll={poll}
                                        currentUserId={CURRENT_USER_ID}
                                        onVote={handleVote}
                                        onRemoveVote={handleRemoveVote}
                                        onAddOption={handleAddOption}
                                        onClosePoll={handleClosePoll}
                                    />
                                </View>
                            )}
                        />
                    </View>
                )}

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <MessageBubble
                            message={item}
                            isCurrentUser={item.senderId === CURRENT_USER_ID}
                            onLongPress={() => item.id && handleLongPress(item.id)}
                            reactions={item.id ? messageReactions.get(item.id) || [] : []}
                            onReactionPress={(emoji) => item.id && handleReactionPress(item.id, emoji)}
                            showPicker={showReactionPicker && selectedMessageId === item.id}
                            onSelectEmoji={handleSelectEmoji}
                            onClosePicker={() => {
                                setShowReactionPicker(false);
                                setSelectedMessageId(null);
                            }}
                        />
                    )}
                    contentContainerStyle={styles.messagesList}
                    inverted={false}
                    onContentSizeChange={() => {
                        flatListRef.current?.scrollToEnd({ animated: false });
                    }}
                />

                <View style={styles.inputContainer}>
                    <ImagePickerButton
                        onImageSelected={handleImageSelected}
                        disabled={sendMessageMutation.isPending}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Your message..."
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                        editable={!sendMessageMutation.isPending}
                        onKeyPress={(e: any) => {
                            // Web: Enter sends, Shift+Enter adds newline
                            if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                                e.preventDefault();
                                if (newMessage.trim()) {
                                    sendMessage();
                                }
                            }
                        }}
                        blurOnSubmit={false}
                        submitBehavior="newline"
                    />
                    <TouchableOpacity
                        onPress={() => sendMessage()}
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

                {/* Create Poll Modal */}
                <CreatePollModal
                    visible={showCreatePoll}
                    onClose={() => setShowCreatePoll(false)}
                    onCreatePoll={handleCreatePoll}
                    isLoading={createPollMutation.isPending}
                />

                {/* Location Search Drawer */}
                <LocationSearchDrawer
                    visible={showLocationSearch}
                    onClose={() => {
                        setShowLocationSearch(false);
                        setSelectedPollId(null);
                    }}
                    onSelectLocation={handleSelectLocation}
                    title="Add Location to Poll"
                />
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
    pollsSection: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingVertical: 8,
    },
    pollsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    pollsTitle: {
        fontWeight: '600',
        color: '#374151',
    },
    pollsScrollContent: {
        paddingLeft: 16,
        paddingRight: 16,
    },
    pollCardWrapper: {
        width: POLL_CARD_WIDTH,
        marginRight: 16,
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
