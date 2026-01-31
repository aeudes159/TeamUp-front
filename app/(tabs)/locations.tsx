import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Appbar, Menu, Button, Searchbar, Text, FAB } from 'react-native-paper';
import { MapPin } from 'lucide-react-native';
import { colors, borderRadius, shadows, typography } from '@/constants/theme';
import { LocationList } from '@/components/location/LocationList';
import { CreateLocationModal } from '@/components/location/CreateLocationModal';
import { EditLocationModal } from '@/components/location/EditLocationModal';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '@/hooks/useLocations';
import type { Location, NewLocation } from '@/types';
import { LocationSort } from '@/types/api';

export default function LocationsScreen() {
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [sort, setSort] = useState<LocationSort>('NAME');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const { data, isLoading, error } = useLocations({
        page: 0,
        size: 20,
        name: search || undefined,
        minPrice,
        maxPrice,
        sort,
    });

    const createLocation = useCreateLocation();
    const updateLocation = useUpdateLocation();
    const deleteLocation = useDeleteLocation();

    const handleLocationPress = (location: Location) => {
        console.log('Location clicked:', location.id);
    };

    const handleCreateLocation = (newLocation: NewLocation) => {
        createLocation.mutate(newLocation, {
            onSuccess: () => {
                setShowCreateModal(false);
            },
            onError: (error) => {
                Alert.alert('Erreur', 'Impossible de créer le lieu. Veuillez réessayer.');
                console.error('Create location error:', error);
            },
        });
    };

    const handleEditLocation = (location: Location) => {
        setSelectedLocation(location);
        setShowEditModal(true);
    };

    const handleUpdateLocation = (locationId: number, updates: Partial<NewLocation>) => {
        updateLocation.mutate(
            { id: locationId, ...updates },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedLocation(null);
                },
                onError: (error) => {
                    Alert.alert('Erreur', 'Impossible de modifier le lieu. Veuillez réessayer.');
                    console.error('Update location error:', error);
                },
            }
        );
    };

    const handleDeleteLocation = (location: Location) => {
        Alert.alert(
            'Supprimer le lieu',
            `Êtes-vous sûr de vouloir supprimer "${location.name || 'ce lieu'}" ?`,
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        if (location.id) {
                            deleteLocation.mutate(location.id, {
                                onError: (error) => {
                                    Alert.alert('Erreur', 'Impossible de supprimer le lieu. Veuillez réessayer.');
                                    console.error('Delete location error:', error);
                                },
                            });
                        }
                    },
                },
            ]
        );
    };

    const getPriceLabel = () => {
        if (minPrice === undefined && maxPrice === undefined) return 'Tous les prix';
        if (minPrice !== undefined && maxPrice !== undefined) return `${minPrice}€ - ${maxPrice}€`;
        if (minPrice !== undefined) return `≥ ${minPrice}€`;
        if (maxPrice !== undefined) return `≤ ${maxPrice}€`;
        return 'Tous les prix';
    };

    return (
        <Screen scrollable={true}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <MapPin size={24} color={colors.lilac} />
                    <Text style={styles.headerTitle}>Lieux</Text>
                    <MapPin size={24} color={colors.coral} />
                </View>
            </View>

            <View style={styles.filtersContainer}>
                <View style={styles.topRow}>
                    <Searchbar
                        placeholder="Rechercher un lieu"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchbar}
                        inputStyle={styles.searchbarInput}
                        iconColor="#3A235A"
                    />

                    <Menu
                        visible={sortMenuVisible}
                        onDismiss={() => setSortMenuVisible(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                compact
                                onPress={() => setSortMenuVisible(true)}
                                style={styles.sortButton}
                                contentStyle={styles.sortButtonContent}
                                labelStyle={styles.sortButtonLabel}
                            >
                                {`Trier : ${sort === 'POPULARITY' ? 'Popularité' : 'Nom'}`}
                            </Button>
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                setSort('NAME');
                                setSortMenuVisible(false);
                            }}
                            title="Nom"
                        />
                        <Menu.Item
                            onPress={() => {
                                setSort('POPULARITY');
                                setSortMenuVisible(false);
                            }}
                            title="Popularité"
                        />
                    </Menu>
                </View>

                <View style={styles.priceFiltersRow}>
                    <Text style={styles.priceFilterLabel}>Échelle de prix :</Text>

                    <Button
                        mode={minPrice === undefined && maxPrice === undefined ? 'contained' : 'outlined'}
                        onPress={() => {
                            setMinPrice(undefined);
                            setMaxPrice(undefined);
                        }}
                        style={styles.priceButton}
                    >
                        Tous les prix
                    </Button>

                    <Button
                        mode={minPrice === 0 && maxPrice === 10 ? 'contained' : 'outlined'}
                        onPress={() => {
                            setMinPrice(0);
                            setMaxPrice(10);
                        }}
                        style={styles.priceButton}
                    >
                        0€ - 10€
                    </Button>

                    <Button
                        mode={minPrice === 10 && maxPrice === 25 ? 'contained' : 'outlined'}
                        onPress={() => {
                            setMinPrice(10);
                            setMaxPrice(25);
                        }}
                        style={styles.priceButton}
                    >
                        10€ - 25€
                    </Button>

                    <Button
                        mode={minPrice === 25 && maxPrice === 50 ? 'contained' : 'outlined'}
                        onPress={() => {
                            setMinPrice(25);
                            setMaxPrice(50);
                        }}
                        style={styles.priceButton}
                    >
                        25€ - 50€
                    </Button>

                    <Button
                        mode={minPrice === 50 && maxPrice === 100 ? 'contained' : 'outlined'}
                        onPress={() => {
                            setMinPrice(50);
                            setMaxPrice(100);
                        }}
                        style={styles.priceButton}
                    >
                        50€ - 100€
                    </Button>
                </View>
            </View>

            <View style={styles.contentContainer}>
                {error && (
                    <View style={styles.errorContainer}>
                        <Text variant="bodyMedium" style={styles.errorText}>
                            Erreur de chargement: {error.message}
                        </Text>
                    </View>
                )}

                <LocationList
                    locations={data ?? []}
                    isLoading={isLoading}
                    onLocationPress={handleLocationPress}
                    onEditLocation={handleEditLocation}
                    onDeleteLocation={handleDeleteLocation}
                />
            </View>

            {/* FAB for creating new location */}
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => setShowCreateModal(true)}
                color="#ffffff"
            />

            {/* Create Location Modal */}
            <CreateLocationModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateLocation={handleCreateLocation}
                isLoading={createLocation.isPending}
            />

            {/* Edit Location Modal */}
            <EditLocationModal
                visible={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedLocation(null);
                }}
                onUpdateLocation={handleUpdateLocation}
                isLoading={updateLocation.isPending}
                location={selectedLocation}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.background,
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 20,
        ...shadows.soft,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    headerTitle: {
        ...typography.titleLarge,
        color: colors.card,
        fontWeight: '700',
    },
    filtersContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 20,
        backgroundColor: colors.card,
    },
    topRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
    },
    searchbar: {
        flex: 1,
        minWidth: 180,
        maxWidth: 320,
        borderRadius: 24,
        height: 48,
        backgroundColor: colors.white,
        ...shadows.soft,
    },
    searchbarInput: {
        paddingVertical: 8,
        fontSize: 16,
        fontFamily: 'System',
    },
    sortButton: {
        borderRadius: 24,
        height: 48,
        justifyContent: 'center',
        minWidth: 140,
        backgroundColor: colors.white,
        ...shadows.soft,
    },
    sortButtonContent: {
        paddingHorizontal: 16,
    },
    sortButtonLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    priceFiltersRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    priceFilterLabel: {
        ...typography.titleSmall,
        marginRight: 12,
        alignSelf: 'center',
        color: colors.primary,
    },
    priceButton: {
        borderRadius: borderRadius.lg,
        minWidth: 90,
        height: 40,
        justifyContent: 'center',
        ...shadows.soft,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: colors.background,
        minHeight: 200,
    },
    errorContainer: {
        padding: 20,
        backgroundColor: '#FEE2E2',
        margin: 20,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    errorText: {
        color: '#DC2626',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: colors.coral,
        borderRadius: borderRadius.pill,
        ...shadows.warm,
    },
});
