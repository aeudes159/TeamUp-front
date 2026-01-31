import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import type { GroupCardProps } from '@/types';

export function GroupCard({ group, onPress }: Readonly<GroupCardProps>) {
    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Content>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text variant="titleMedium" style={styles.name}>{group.name}</Text>
                        {group.createdAt && (
                            <Text variant="bodySmall" style={styles.description}>
                                Created {new Date(group.createdAt).toLocaleDateString()}
                            </Text>
                        )}
                    </View>
                    <Chip icon={group.isPublic ? "earth" : "lock"}>
                        {group.isPublic ? 'Public' : 'Private'}
                    </Chip>
                </View>
            </Card.Content>
            {group.coverPictureUrl && (
                <Card.Cover source={{ uri: group.coverPictureUrl }} />
            )}
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
        marginRight: 12,
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        color: '#6b7280',
    },
});
