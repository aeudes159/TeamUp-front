import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, Avatar } from 'react-native-paper';
import type { GroupCardProps } from '@/types';

export function GroupCard({ group, onPress }: Readonly<GroupCardProps>) {
    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Content>
                <View style={styles.container}>
                    {group.coverPictureUrl ? (
                        <Avatar.Image
                            source={{ uri: group.coverPictureUrl }}
                            size={60}
                            style={styles.avatar}
                        />
                    ) : (
                        <Avatar.Icon
                            icon="account-group"
                            size={60}
                            style={styles.avatar}
                        />
                    )}
                    <View style={styles.textContainer}>
                        <Text variant="titleMedium" style={styles.name}>{group.name}</Text>
                        {group.createdAt && (
                            <Text variant="bodySmall" style={styles.description}>
                                Created {new Date(group.createdAt).toLocaleDateString()}
                            </Text>
                        )}
                    </View>
                    <View style={styles.rightSection}>
                        <Chip icon={group.isPublic ? "earth" : "lock"} style={styles.chip}>
                            {group.isPublic ? 'Public' : 'Private'}
                        </Chip>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        marginHorizontal: 12,
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        color: '#6b7280',
    },
    rightSection: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
    },
    chip: {
        height: 28,
    },
    avatar: {
        backgroundColor: '#e5e7eb',
    },
});
