import { View, StyleSheet, Image } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import type { MessageBubbleProps } from '@/types';
import { useTheme } from 'react-native-paper';

export function MessageBubble({ message, isCurrentUser }: Readonly<MessageBubbleProps>) {
    const theme = useTheme();
    
    return (
        <View style={[styles.container, isCurrentUser ? styles.containerEnd : styles.containerStart]}>
            {!isCurrentUser && (
                <Image
                    source={{ uri: message.avatar_url }}
                    style={styles.avatar}
                />
            )}

            <View style={[styles.messageContainer, isCurrentUser ? styles.messageEnd : styles.messageStart]}>
                {!isCurrentUser && (
                    <Text variant="labelSmall" style={styles.username}>{message.username}</Text>
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
                    <Text style={isCurrentUser ? styles.textWhite : styles.textDark}>
                        {message.content}
                    </Text>
                </Surface>

                <Text variant="labelSmall" style={styles.timestamp}>
                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            </View>

            {isCurrentUser && (
                <Image
                    source={{ uri: message.avatar_url }}
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
    },
    textWhite: {
        color: '#ffffff',
    },
    textDark: {
        color: '#1f2937',
    },
    timestamp: {
        marginTop: 4,
        marginHorizontal: 8,
        color: '#9ca3af',
    },
});
