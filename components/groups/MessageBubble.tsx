import { View, StyleSheet, Image } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import type { MessageBubbleProps } from '@/types';
import { useTheme } from 'react-native-paper';

/**
 * MessageBubble component for displaying chat messages
 * 
 * Note: The new API doesn't include avatar_url and username in the message.
 * These should be passed via the optional senderName and senderAvatar props,
 * or fetched separately using the senderId.
 */
export function MessageBubble({ 
    message, 
    isCurrentUser,
    senderName,
    senderAvatar 
}: Readonly<MessageBubbleProps>) {
    const theme = useTheme();
    
    // Default avatar placeholder
    const avatarUrl = senderAvatar || `https://i.pravatar.cc/150?u=${message.senderId}`;
    const displayName = senderName || `User ${message.senderId}`;
    
    return (
        <View style={[styles.container, isCurrentUser ? styles.containerEnd : styles.containerStart]}>
            {!isCurrentUser && (
                <Image
                    source={{ uri: avatarUrl }}
                    style={styles.avatar}
                />
            )}

            <View style={[styles.messageContainer, isCurrentUser ? styles.messageEnd : styles.messageStart]}>
                {!isCurrentUser && (
                    <Text variant="labelSmall" style={styles.username}>{displayName}</Text>
                )}

                <Surface 
                    style={[
                        styles.bubble,
                        isCurrentUser 
                            ? { backgroundColor: theme.colors.primary }
                            : { backgroundColor: theme.colors.surfaceVariant }
                    ]}
                    elevation={1}
                >
                    {message.content && (
                        <Text style={isCurrentUser ? styles.textWhite : styles.textDark}>
                            {message.content}
                        </Text>
                    )}
                    {message.imageUrl && (
                        <Image 
                            source={{ uri: message.imageUrl }} 
                            style={styles.messageImage}
                            resizeMode="cover"
                        />
                    )}
                </Surface>

                {message.sentAt && (
                    <Text variant="labelSmall" style={styles.timestamp}>
                        {new Date(message.sentAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                )}
            </View>

            {isCurrentUser && (
                <Image
                    source={{ uri: avatarUrl }}
                    style={styles.avatar}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    containerStart: {
        justifyContent: 'flex-start',
    },
    containerEnd: {
        justifyContent: 'flex-end',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginHorizontal: 8,
    },
    messageContainer: {
        maxWidth: '75%',
    },
    messageStart: {
        alignItems: 'flex-start',
    },
    messageEnd: {
        alignItems: 'flex-end',
    },
    username: {
        marginBottom: 4,
        marginLeft: 8,
        color: '#6b7280',
    },
    bubble: {
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        overflow: 'hidden',
    },
    textWhite: {
        color: '#ffffff',
    },
    textDark: {
        color: '#1f2937',
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 8,
        marginTop: 8,
    },
    timestamp: {
        marginTop: 4,
        marginHorizontal: 8,
        color: '#9ca3af',
    },
});
