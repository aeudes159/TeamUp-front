/**
 * LocationList Component - Refactored to use shared state components
 * 
 * Demonstrates the reusable pattern for list components.
 * Uses ListWrapper for loading/empty states, reducing code by ~50%.
 */

import { FlatList, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { LocationCard } from './LocationCard';
import { ListWrapper } from '@/components/ui/StateComponents';
import type { Location } from '@/types';

type LocationListProps = {
    locations: Location[];
    onLocationPress?: (location: Location) => void;
    isLoading?: boolean;
    error?: Error | null;
    onRetry?: () => void;
};

export function LocationList({
    locations,
    onLocationPress,
    isLoading = false,
    error = null,
    onRetry,
}: Readonly<LocationListProps>) {
    return (
        <ListWrapper
            isLoading={isLoading}
            error={error}
            isEmpty={locations.length === 0}
            loadingMessage="Chargement des lieux..."
            emptyTitle="Aucun lieu disponible"
            emptySubtitle="Ajoutez un nouveau lieu pour commencer"
            emptyIcon={<MapPin size={48} color="#d1d5db" />}
            onRetry={onRetry}
        >
            <FlatList
                data={locations}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <LocationCard
                        location={item}
                        onPress={() => onLocationPress?.(item)}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </ListWrapper>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});
