import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import type { Location } from '@/types';

type LocationCardProps = {
    location: Location;
    onPress?: () => void;
};

export function LocationCard({ location, onPress }: LocationCardProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.card}>
                {location.pictureUrl && (
                    <Image
                        source={{ uri: location.pictureUrl }}
                        style={styles.image}
                    />
                )}

                <View style={styles.content}>
                    <Text variant="titleMedium" style={styles.name}>
                        {location.name ?? 'Lieu sans nom'}
                    </Text>

                    {location.address && (
                        <Text variant="bodyMedium" style={styles.address}>
                            {location.address}
                        </Text>
                    )}

                    {location.averagePrice !== undefined && (
                        <Text variant="bodySmall" style={styles.price}>
                            Prix moyen : {location.averagePrice} €
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 160,
    },
    content: {
        padding: 12,
    },
    name: {
        fontWeight: '600',
        color: '#111827',
    },
    address: {
        marginTop: 4,
        color: '#6b7280',
    },
    price: {
        marginTop: 8,
        color: '#374151',
        fontWeight: '500',
    },
});
