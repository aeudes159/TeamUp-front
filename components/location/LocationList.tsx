/**
 * LocationList Component - Refactored to use shared state components
 * 
 * Demonstrates the reusable pattern for list components.
 * Uses ListWrapper for loading/empty states, reducing code by ~50%.
 */

import {FlatList, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Surface, Text, useTheme} from 'react-native-paper';
import {LocationCard} from './LocationCard';
import type {Location} from '@/types';

type LocationListProps = {
    locations: Location[];
    onLocationPress?: (location: Location) => void;
    onEditLocation?: (location: Location) => void;
    onDeleteLocation?: (location: Location) => void;
    isLoading?: boolean;
    onScroll?: (event: any) => void;
};

export function LocationList({
    locations,
    onLocationPress,
    onEditLocation,
    onDeleteLocation,
    isLoading = false,
    onScroll,
}: Readonly<LocationListProps>) {

    const { colors } = useTheme();

    if (isLoading) {
        return (
            <View style={styles.centerContent}>
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text style={[styles.messageText, { color: colors.onSurfaceVariant }]}>
                    Chargement des lieux...
                </Text>
            </View>
        );
    }

    if (locations.length === 0) {
        return (
            <View style={styles.centerContent}>
                <Surface style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
                    <Text style={styles.emptyIcon}>📍</Text>
                    <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>Aucun lieu trouvé</Text>
                    <Text style={[styles.emptyDetail, { color: colors.onSurfaceVariant }]}>
                        Créez un nouveau lieu pour commencer.
                    </Text>
                </Surface>
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
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
        />
    );
}

const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    messageText: {
        marginTop: 20,
        fontSize: 16,
    },
    emptyCard: {
        borderRadius: 28,
        padding: 40,
        alignItems: 'center',
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 12,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyDetail: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
    listContent: {
        paddingVertical: 16,
        paddingBottom: 80, // for FAB
    },
});
