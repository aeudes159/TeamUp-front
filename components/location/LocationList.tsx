import { FlatList, View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LocationCard } from './LocationCard';
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
                <ActivityIndicator size="large" />
                <Text variant="bodyMedium" style={styles.loadingText}>
                    Chargement des lieux...
                </Text>
            </View>
        );
    }

    if (locations.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text variant="bodyLarge" style={styles.emptyText}>
                    Aucun lieu disponible
                </Text>
                <Text variant="bodyMedium" style={styles.emptySubtext}>
                    Ajoutez un nouveau lieu pour commencer
                </Text>
            </View>
        );
    }

    return (
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
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        color: '#6b7280',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyText: {
        textAlign: 'center',
        color: '#374151',
        fontWeight: '600',
    },
    emptySubtext: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});
