import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';

type Event = {
    id: string;
    title: string;
    description: string;
    image_url: string;
    event_date: string;
    location: string;
    max_participants: number;
};

type EventCardProps = {
    event: Event;
    onPress?: () => void;
};

export function EventCard({ event, onPress }: Readonly<EventCardProps>) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card className="mb-4">
                <Image
                    source={{ uri: event.image_url }}
                    className="w-full h-48 rounded-lg mb-3"
                    resizeMode="cover"
                />

                <Text className="text-xl font-bold mb-2" >{event.title}</Text>

                <Text className="text-gray-600 mb-3" numberOfLines={2}>
                    {event.description}
                </Text>

                <View className="flex-row items-center mb-2">
                    <Text className="text-sm text-gray-500 mr-4">📍 {event.location}</Text>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-gray-500">
                        📅 {new Date(event.event_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                    </Text>
                    <Text className="text-sm text-primary font-semibold">
                        👥 {event.max_participants} places
                    </Text>
                </View>
            </Card>
        </TouchableOpacity>
    );
}