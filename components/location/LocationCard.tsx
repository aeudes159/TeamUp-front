import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import type { Location } from '@/types';

type LocationCardProps = {
    location: Location;
    onPress?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
};

export function LocationCard({ location, onPress, onEdit, onDelete, showActions = true }: LocationCardProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.card}>
                {location.pictureUrl && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: location.pictureUrl }}
                            style={styles.image}
                        />
                        {showActions && (onEdit || onDelete) && (
                            <View style={styles.imageActions}>
                                {onEdit && (
                                    <IconButton
                                        icon="pencil"
                                        size={18}
                                        iconColor="#ffffff"
                                        style={styles.actionButton}
                                        onPress={(e) => {
                                            e.stopPropagation?.();
                                            onEdit();
                                        }}
                                    />
                                )}
                                {onDelete && (
                                    <IconButton
                                        icon="delete"
                                        size={18}
                                        iconColor="#ffffff"
                                        style={styles.deleteButton}
                                        onPress={(e) => {
                                            e.stopPropagation?.();
                                            onDelete();
                                        }}
                                    />
                                )}
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text variant="titleMedium" style={styles.name}>
                            {location.name ?? 'Lieu sans nom'}
                        </Text>
                        {showActions && !location.pictureUrl && (onEdit || onDelete) && (
                            <View style={styles.noImageActions}>
                                {onEdit && (
                                    <IconButton
                                        icon="pencil"
                                        size={18}
                                        iconColor="#6366f1"
                                        style={styles.noImageActionButton}
                                        onPress={(e) => {
                                            e.stopPropagation?.();
                                            onEdit();
                                        }}
                                    />
                                )}
                                {onDelete && (
                                    <IconButton
                                        icon="delete"
                                        size={18}
                                        iconColor="#ef4444"
                                        style={styles.noImageActionButton}
                                        onPress={(e) => {
                                            e.stopPropagation?.();
                                            onDelete();
                                        }}
                                    />
                                )}
                            </View>
                        )}
                    </View>

                    {location.address && (
                        <Text variant="bodyMedium" style={styles.address}>
                            {location.address}
                        </Text>
                    )}

                    {location.averagePrice !== undefined && location.averagePrice !== null && (
                        <Text variant="bodySmall" style={styles.price}>
                            Prix moyen : {location.averagePrice} €
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 2,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 160,
    },
    imageActions: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        gap: 4,
    },
    actionButton: {
        backgroundColor: 'rgba(99, 102, 241, 0.9)',
        margin: 0,
    },
    deleteButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        margin: 0,
    },
    content: {
        padding: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        fontWeight: '600',
        color: '#111827',
        flex: 1,
    },
    noImageActions: {
        flexDirection: 'row',
        marginLeft: 8,
    },
    noImageActionButton: {
        margin: 0,
        marginLeft: -4,
    },
    address: {
        marginTop: 4,
        color: '#6b7280',
    },
    price: {
        marginTop: 8,
        color: '#374151',
        fontWeight: '500',
    },
});
