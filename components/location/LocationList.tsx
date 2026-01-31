import { FlatList, View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LocationCard } from './LocationCard';
import { colors, borderRadius, shadows, typography } from '@/constants/theme';
import { MapPin } from 'lucide-react-native';
import type { Location } from '@/types';

type LocationListProps = {
    locations: Location[];
    onLocationPress?: (location: Location) => void;
    onEditLocation?: (location: Location) => void;
    onDeleteLocation?: (location: Location) => void;
    isLoading?: boolean;
};

export function LocationList({
                                 locations,
                                 onLocationPress,
                                 onEditLocation,
                                 onDeleteLocation,
                                 isLoading = false,
                             }: Readonly<LocationListProps>) {

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingIconContainer}>
                    <ActivityIndicator size="large" color={colors.lilac} />
                </View>
                <Text style={styles.loadingText}>
                    Chargement des lieux...
                </Text>
            </View>
        );
    }

    if (locations.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                    <MapPin size={48} color={colors.coral} />
                </View>
                <Text style={styles.emptyText}>
                    Aucun lieu disponible
                </Text>
                <Text style={styles.emptySubtext}>
                    Ajoutez un nouveau lieu pour commencer
                </Text>
                <View style={styles.decorativeDots}>
                    <View style={[styles.dot, { backgroundColor: colors.lilac }]} />
                    <View style={[styles.dot, { backgroundColor: colors.yellow }]} />
                    <View style={[styles.dot, { backgroundColor: colors.coral }]} />
                </View>
            </View>
        );
    }

    return (
        <div style={{ marginTop: "1rem" }}>
        <FlatList
            data={locations}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
                <LocationCard
                    location={item}
                    onPress={() => onLocationPress?.(item)}
                    onEdit={onEditLocation ? () => onEditLocation(item) : undefined}
                    onDelete={onDeleteLocation ? () => onDeleteLocation(item) : undefined}
                />
            )}
            contentContainerStyle={styles.listContent}
        />
        </div>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    loadingIconContainer: {
        padding: 20,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.card,
        marginBottom: 20,
        ...shadows.warm,
    },
    loadingText: {
        ...typography.bodyMedium,
        color: colors.card,
        textAlign: 'center',
        marginTop: 16,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyIconContainer: {
        padding: 20,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.card,
        marginBottom: 24,
        ...shadows.artistic,
    },
    emptyText: {
        ...typography.titleMedium,
        color: colors.card,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        ...typography.bodyMedium,
        color: colors.cardLight,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    decorativeDots: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: borderRadius.pill,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});
