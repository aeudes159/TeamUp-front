import {Text, TouchableOpacity, View} from 'react-native';
import {Screen} from '@/components/layout/Screen';
import {EventList} from '@/components/events/EventList';
import {mockEvents} from '@/mock/data';
import {useState} from 'react';

export default function FeedScreen() {
    const [events] = useState(mockEvents);

    return (
        <Screen scrollable={false} className="flex-1">
            <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
                <Text className="text-2xl font-bold">🎉 Événements</Text>
                <TouchableOpacity
                    className="bg-primary px-4 py-2 rounded-lg"
                    onPress={() => {/* TODO: ouvrir modal création */
                    }}
                >
                    <Text className="text-white font-semibold">+ Créer</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1">
                <EventList
                    events={events}
                    onEventPress={(event) => {
                        console.log('Event clicked:', event.title);
                        // TODO: naviguer vers détail événement
                    }}
                />
            </View>
        </Screen>
    );
}