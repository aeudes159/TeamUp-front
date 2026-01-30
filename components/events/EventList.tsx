import { FlatList, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { EventCard } from './EventCard';
import type { Event } from '@/types';

type EventListProps = {
    events: Event[];
    onEventPress?: (event: Event) => void;
};

export function EventList({ events, onEventPress }: Readonly<EventListProps>) {
    if (events.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text variant="bodyLarge" style={styles.emptyText}>
                    Aucun événement pour le moment 😔
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <EventCard
                    event={item}
                    onPress={() => onEventPress?.(item)}
                />
            )}
            contentContainerStyle={styles.listContent}
        />
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
});
