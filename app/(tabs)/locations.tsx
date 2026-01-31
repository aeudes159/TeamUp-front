import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Animated, TouchableOpacity, Platform } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Button, Searchbar, Text, FAB, Surface, useTheme, IconButton, Menu, Divider } from 'react-native-paper';
import { LocationList } from '@/components/location/LocationList';
import { CreateLocationModal } from '@/components/location/CreateLocationModal';
import { EditLocationModal } from '@/components/location/EditLocationModal';
import { LocationDetailsModal } from '@/components/location/LocationDetailsModal';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '@/hooks/useLocations';
import type { Location, NewLocation } from '@/types';
import { LocationSort } from '@/types/api';
import { colors, shadows, borderRadius, spacing, typography } from '@/constants/theme';
import { Filter, ChevronDown, Check } from 'lucide-react-native';

const CURRENT_USER_ID = 1; // Mock user ID

export default function LocationsScreen() {
    const theme = useTheme();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sort, setSort] = useState<LocationSort>('NAME');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [scrollY] = useState(new Animated.Value(0));

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -10],
        extrapolate: 'clamp',
    });

    const { data, isLoading, error } = useLocations({
        page: 0,
        size: 20,
        name: debouncedSearch || undefined,
        sort,
    });

    const createLocation = useCreateLocation();
    const updateLocation = useUpdateLocation();
    const deleteLocation = useDeleteLocation();

    const handleLocationPress = (location: Location) => {
        setSelectedLocation(location);
        setShowDetailsModal(true);
    };

    const handleCreateLocation = (newLocation: NewLocation) => {
        createLocation.mutate(newLocation, {
            onSuccess: () => {
                setShowCreateModal(false);
            },
            onError: (err) => {
                Alert.alert('Erreur', 'Impossible de créer le lieu. Veuillez réessayer.');
                console.error('Create location error:', err);
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
                onError: (err) => {
                    Alert.alert('Erreur', 'Impossible de modifier le lieu. Veuillez réessayer.');
                    console.error('Update location error:', err);
                },
            }
        );
    };

    const handleDeleteLocation = (location: Location) => {
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer "${location.name || 'ce lieu'}" ?`);
            if (confirmed && location.id) {
                deleteLocation.mutate(location.id, {
                    onError: (err) => {
                        console.error('Delete location error:', err);
                        alert('Impossible de supprimer le lieu. Veuillez réessayer.');
                    },
                });
            }
        } else {
            Alert.alert(
                'Supprimer le lieu',
                `Êtes-vous sûr de vouloir supprimer "${location.name || 'ce lieu'}" ?`,
                [
                    { text: 'Annuler', style: 'cancel' },
                    {
                        text: 'Supprimer',
                        style: 'destructive',
                        onPress: () => {
                            if (location.id) {
                                deleteLocation.mutate(location.id, {
                                    onError: (err) => {
                                        Alert.alert('Erreur', 'Impossible de supprimer le lieu. Veuillez réessayer.');
                                        console.error('Delete location error:', err);
                                    },
                                });
                            }
                        },
                    },
                ]
            );
        }
    };

    const openSortMenu = () => setSortMenuVisible(true);
    const closeSortMenu = () => setSortMenuVisible(false);

    const handleSortChange = (newSort: LocationSort) => {
        setSort(newSort);
        closeSortMenu();
    };

    return (
        <Screen scrollable={false} style={{ backgroundColor: colors.background }}>
            <Animated.View 
                style={[
                    styles.headerContainer, 
                    { 
                        opacity: headerOpacity,
                        transform: [{ translateY: headerTranslateY }]
                    }
                ]}
            >
                <Surface style={[styles.headerSurface, shadows.soft]} elevation={0}>
                    <Text style={[styles.title, { color: colors.text }]}>Activités</Text>
                    
                    <View style={styles.searchContainer}>
                        <Searchbar
                            placeholder="Rechercher une activité..."
                            onChangeText={setSearch}
                            value={search}
                            style={styles.searchBar}
                            inputStyle={styles.searchInput}
                            iconColor={colors.textSecondary}
                            placeholderTextColor={colors.textSecondary}
                            elevation={0}
                        />
                        
                        <Menu
                            visible={sortMenuVisible}
                            onDismiss={closeSortMenu}
                            anchor={
                                <TouchableOpacity onPress={openSortMenu} style={styles.sortButton} activeOpacity={0.7}>
                                    <Filter size={20} color={colors.primary} />
                                </TouchableOpacity>
                            }
                            contentStyle={styles.menuContent}
                        >
                            <Menu.Item 
                                onPress={() => handleSortChange('NAME')} 
                                title="Nom (A-Z)" 
                                leadingIcon={() => sort === 'NAME' ? <Check size={18} color={colors.primary} /> : null}
                                titleStyle={sort === 'NAME' ? styles.activeMenuItem : styles.menuItem}
                            />
                            <Divider />
                            <Menu.Item 
                                onPress={() => handleSortChange('POPULARITY')} 
                                title="Popularité" 
                                leadingIcon={() => sort === 'POPULARITY' ? <Check size={18} color={colors.primary} /> : null}
                                titleStyle={sort === 'POPULARITY' ? styles.activeMenuItem : styles.menuItem}
                            />
                        </Menu>
                    </View>
                </Surface>
            </Animated.View>

            <View style={styles.contentContainer}>
                <LocationList
                    locations={data ?? []}
                    isLoading={isLoading}
                    onLocationPress={handleLocationPress}
                    onEditLocation={handleEditLocation}
                    onDeleteLocation={handleDeleteLocation}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                />
            </View>

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => setShowCreateModal(true)}
                color={colors.white}
            />

            <CreateLocationModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateLocation={handleCreateLocation}
                isLoading={createLocation.isPending}
            />
            <EditLocationModal
                visible={showEditModal}
                onClose={() => { setShowEditModal(false); setSelectedLocation(null); }}
                onUpdateLocation={handleUpdateLocation}
                isLoading={updateLocation.isPending}
                location={selectedLocation}
            />
            <LocationDetailsModal
                visible={showDetailsModal}
                onClose={() => { setShowDetailsModal(false); setSelectedLocation(null); }}
                location={selectedLocation}
                currentUserId={CURRENT_USER_ID}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 16,
        paddingHorizontal: spacing.lg,
        paddingBottom: 8,
        zIndex: 10,
    },
    headerSurface: {
        borderRadius: borderRadius.lg,
        backgroundColor: colors.card,
        padding: spacing.md,
        paddingBottom: spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
        color: colors.text,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    searchBar: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        height: 46,
    },
    searchInput: {
        ...typography.bodyMedium,
        minHeight: 0, 
    },
    sortButton: {
        width: 46,
        height: 46,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.cardLight,
    },
    menuContent: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        marginTop: 4,
        ...shadows.soft,
    },
    menuItem: {
        color: colors.text,
    },
    activeMenuItem: {
        color: colors.primary,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: colors.background,
        marginTop: -10, // Slight overlap for smooth look
        paddingTop: 10,
    },
    fab: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        borderRadius: borderRadius.xl,
    },
});
