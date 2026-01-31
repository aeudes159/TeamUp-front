import { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Searchbar, Surface, ActivityIndicator, IconButton } from 'react-native-paper';
import {MapPin, Euro} from 'lucide-react-native';
import { useLocationSearch, useLocations } from '@/hooks/useLocations';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { Location } from '@/types';

type LocationSearchDrawerProps = {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
  title?: string;
};

type LocationItemProps = {
  location: Location;
  onSelect: (location: Location) => void;
};

function LocationItem({ location, onSelect }: Readonly<LocationItemProps>) {
  return (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => onSelect(location)}
    >
      {location.pictureUrl ? (
        <Image source={{ uri: location.pictureUrl }} style={styles.locationImage} />
      ) : (
        <View style={[styles.locationImage, styles.placeholderImage]}>
          <MapPin size={24} color="#9ca3af" />
        </View>
      )}
      <View style={styles.locationInfo}>
        <Text variant="bodyLarge" style={styles.locationName}>
          {location.name || 'Unknown'}
        </Text>
        {location.address && (
          <View style={styles.addressRow}>
            <MapPin size={12} color="#6b7280" />
            <Text variant="bodySmall" style={styles.locationAddress}>
              {location.address}
            </Text>
          </View>
        )}
        {location.averagePrice !== null && (
          <View style={styles.priceRow}>
            <Text variant="bodySmall" style={styles.locationPrice}>
              {location.averagePrice}
            </Text>
            <Euro size={12} color="#10b981" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function LocationSearchDrawer({
  visible,
  onClose,
  onSelectLocation,
  title = 'Add Location',
}: Readonly<LocationSearchDrawerProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  // Use search results if query exists, otherwise show all locations
  const {
    data: searchResults,
    isLoading: isSearching,
  } = useLocationSearch(debouncedQuery, { page: 0, size: 50 });

  const {
    data: allLocations,
    isLoading: isLoadingAll,
  } = useLocations({ page: 0, size: 50 });

  // Extract the data array from the response (hooks now return LocationListResponse)
  const locations = debouncedQuery.trim() ? searchResults?.data : allLocations?.data;
  const isLoading = debouncedQuery.trim() ? isSearching : isLoadingAll;

  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location);
    setSearchQuery('');
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <Surface style={styles.modalContent} elevation={5}>
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>
              {title}
            </Text>
            <IconButton icon="close" onPress={handleClose} />
          </View>

          <Searchbar
            placeholder="Search locations..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Searching locations...</Text>
            </View>
          ) : locations && locations.length > 0 ? (
            <FlatList
              data={locations}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <LocationItem location={item} onSelect={handleSelectLocation} />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MapPin size={48} color="#d1d5db" />
              <Text variant="bodyLarge" style={styles.emptyText}>
                {debouncedQuery.trim()
                  ? 'No locations found'
                  : 'No locations available'}
              </Text>
              <Text variant="bodySmall" style={styles.emptySubtext}>
                {debouncedQuery.trim()
                  ? 'Try a different search term'
                  : 'Locations will appear here'}
              </Text>
            </View>
          )}
        </Surface>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  locationImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationAddress: {
    color: '#6b7280',
    marginLeft: 4,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPrice: {
    color: '#10b981',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtext: {
    color: '#9ca3af',
    marginTop: 4,
  },
});
