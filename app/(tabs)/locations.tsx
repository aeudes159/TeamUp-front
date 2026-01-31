import { View, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Appbar, Menu, Button, Searchbar, Text } from 'react-native-paper';
import { LocationList } from '@/components/location/LocationList';
import { useLocations } from '@/hooks/useLocations';
import type { Location } from '@/types';
import { useState } from 'react';
import { LocationSort } from '@/types/api';

export default function EventsScreen() {
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [sort, setSort] = useState<LocationSort>('NAME');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);

    const { data, isLoading, error } = useLocations({
        page: 0,
        size: 20,
        name: search || undefined,
        minPrice,
        maxPrice,
        sort,
    });

    const handleLocationPress = (location: Location) => {
        console.log('Location clicked:', location.id);
    };

    const getPriceLabel = () => {
        if (minPrice === undefined && maxPrice === undefined) return 'Tous les prix';
        if (minPrice !== undefined && maxPrice !== undefined) return `${minPrice}€ - ${maxPrice}€`;
        if (minPrice !== undefined) return `≥ ${minPrice}€`;
        if (maxPrice !== undefined) return `≤ ${maxPrice}€`;
        return 'Tous les prix';
    };

    return (
        <Screen scrollable={false}>
            <Appbar.Header>
                <Appbar.Content title="Événements" />
                <Appbar.Action icon="plus" onPress={() => {}} />
            </Appbar.Header>

            <View style={styles.filtersContainer}>
                <View style={styles.topRow}>
                    <Searchbar
                        placeholder="Rechercher un lieu"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchbar}
                        inputStyle={styles.searchbarInput}
                        iconColor="#6b7280"
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

            <View style={styles.container}>
                {error && (
                    <View style={styles.errorContainer}>
                        <Text variant="bodyMedium" style={styles.errorText}>
                            Erreur de chargement: {error.message}
                        </Text>
                    </View>
                )}

                <LocationList
                    locations={data?.data ?? []}
                    isLoading={isLoading}
                    onLocationPress={handleLocationPress}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    filtersContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 12,
    },
    topRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
    },
    searchbar: {
        flex: 1,
        minWidth: 150,
        maxWidth: 300,
        borderRadius: 12,
        height: 40,
    },
    searchbarInput: {
        paddingVertical: 6,
        fontSize: 14,
    },
    sortButton: {
        borderRadius: 12,
        height: 40,
        justifyContent: 'center',
        minWidth: 130,
    },
    sortButtonContent: {
        paddingHorizontal: 8,
    },
    sortButtonLabel: {
        fontSize: 13,
    },
    priceFiltersRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    priceFilterLabel: {
        fontSize: 16,
        marginRight: 8,
        alignSelf: 'center',
    },
    priceButton: {
        borderRadius: 12,
        minWidth: 80,
        height: 36,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#fee2e2',
        margin: 16,
        borderRadius: 8,
    },
    errorText: {
        color: '#dc2626',
        textAlign: 'center',
    },
});
