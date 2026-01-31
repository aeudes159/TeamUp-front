import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { colors, borderRadius, shadows, typography } from '@/constants/theme';
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
                                        iconColor={colors.lilac}
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
                                        iconColor={colors.coral}
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
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        marginBottom: 20,
        ...shadows.soft,
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
        backgroundColor: `${colors.lilac}E6`,
        margin: 0,
        borderRadius: borderRadius.md,
    },
    deleteButton: {
        backgroundColor: `${colors.coral}E6`,
        margin: 0,
        borderRadius: borderRadius.md,
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
        ...typography.titleSmall,
        flex: 1,
    },
    noImageActions: {
        flexDirection: 'row',
        marginLeft: 12,
    },
    noImageActionButton: {
        margin: 0,
        marginLeft: -4,
        borderRadius: borderRadius.md,
    },
    address: {
        marginTop: 8,
        ...typography.bodyMedium,
        color: colors.textSecondary,
    },
    price: {
        marginTop: 12,
        ...typography.bodySmall,
        color: colors.text,
        fontWeight: '600',
        backgroundColor: colors.yellow,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borderRadius.md,
    },
});
