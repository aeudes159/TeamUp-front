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
                                        iconColor="#FFFFFF"
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
                                        iconColor="#FFFFFF"
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
                                        iconColor="#B8A1D9"
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
                                        iconColor="#F08A5D"
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
        backgroundColor: '#F3D1C8',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 180,
    },
    imageActions: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        backgroundColor: 'rgba(184, 161, 217, 0.9)',
        margin: 0,
        borderRadius: 16,
    },
    deleteButton: {
        backgroundColor: 'rgba(240, 138, 93, 0.9)',
        margin: 0,
        borderRadius: 16,
    },
    content: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        fontWeight: '700',
        color: '#2E1A47',
        flex: 1,
        fontSize: 18,
        fontFamily: 'System',
    },
    noImageActions: {
        flexDirection: 'row',
        marginLeft: 12,
    },
    noImageActionButton: {
        margin: 0,
        marginLeft: -4,
        borderRadius: 16,
    },
    address: {
        marginTop: 8,
        color: '#3A235A',
        fontSize: 15,
        opacity: 0.8,
    },
    price: {
        marginTop: 12,
        color: '#3A235A',
        fontWeight: '600',
        fontSize: 16,
        backgroundColor: '#F6D186',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
});
