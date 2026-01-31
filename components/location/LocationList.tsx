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
        padding: 40,
        backgroundColor: '#F6E6D8',
    },
    loadingText: {
        marginTop: 20,
        color: '#3A235A',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'System',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#F6E6D8',
    },
    emptyText: {
        textAlign: 'center',
        color: '#2E1A47',
        fontWeight: '700',
        fontSize: 20,
        fontFamily: 'System',
    },
    emptySubtext: {
        textAlign: 'center',
        color: '#3A235A',
        marginTop: 12,
        fontSize: 16,
        opacity: 0.8,
        fontFamily: 'System',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});
