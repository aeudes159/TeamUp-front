import { FlatList, View, Text } from 'react-native';
import { EventCard } from './EventCard';
import type { Event } from '@/types';

type EventListProps = {
    events: Event[];
    onEventPress?: (event: Event) => void;
};

export function EventList({ events, onEventPress }: Readonly<EventListProps>) {
    if (events.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-8">
                <Text className="text-gray-500 text-center text-lg">
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
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        />
    );
}