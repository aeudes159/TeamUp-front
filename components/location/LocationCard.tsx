import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { colors, shadows, borderRadius, spacing, typography } from '@/constants/theme';
import type { Location } from '@/types';

type LocationCardProps = {
    location: Location;
    onPress?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
};

export function LocationCard({ location, onPress, onEdit, onDelete, showActions = true }: Readonly<LocationCardProps>) {
    return (
        <Surface style={[styles.card, shadows.soft]} elevation={2}>
            {location.pictureUrl && (
                <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: location.pictureUrl }}
                            style={styles.image}
                        />
                    </View>
                </TouchableOpacity>
            )}

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1 }}>
                        <Text style={[typography.titleMedium, styles.name]}>
                            {location.name ?? 'Lieu sans nom'}
                        </Text>
                    </TouchableOpacity>
                    
                    {showActions && (onEdit || onDelete) && (
                        <View style={styles.actions}>
                            {onEdit && (
                                <IconButton
                                    icon="pencil"
                                    size={20}
                                    iconColor={colors.primary}
                                    onPress={onEdit}
                                />
                            )}
                            {onDelete && (
                                <IconButton
                                    icon="delete"
                                    size={20}
                                    iconColor={colors.coral}
                                    onPress={onDelete}
                                />
                            )}
                        </View>
                    )}
                </View>

                <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                    <View>
                        {location.address && (
                            <Text style={[typography.bodyMedium, styles.address]}>
                                {location.address}
                            </Text>
                        )}

                        {location.averagePrice !== undefined && location.averagePrice !== null && (
                            <Text style={[typography.bodySmall, styles.price]}>
                                Prix moyen : {location.averagePrice} €
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </Surface>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg,
        backgroundColor: colors.card,
        overflow: 'hidden',
        marginBottom: spacing.md,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 180,
    },
    content: {
        padding: spacing.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    name: {
        color: colors.text,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        marginLeft: spacing.sm,
    },
    address: {
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    price: {
        color: colors.primary,
        fontWeight: '600',
    },
});

