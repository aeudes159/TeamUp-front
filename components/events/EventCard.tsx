import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Card, Text, Chip, Button as PaperButton } from 'react-native-paper';
import { Calendar, MapPin, Users } from 'lucide-react-native';
import type { Event, EventCardProps } from '@/types';

export function EventCard({
    event,
    onPress,
}: Readonly<EventCardProps>) {
    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Cover source={{ uri: event.image_url }} style={styles.cover} />
            
            <Card.Content style={styles.content}>
                <View style={styles.header}>
                    <Text variant="titleLarge" style={styles.title}>{event.title}</Text>
                    <Chip icon={() => <Users size={16} />} style={styles.chip}>
                        {event.max_participants}
                    </Chip>
                </View>

                <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                    {event.description}
                </Text>

                <View style={styles.infoRow}>
                    <Calendar size={16} color="#6366f1" />
                    <Text variant="bodySmall" style={styles.infoText}>
                        {new Date(event.event_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <MapPin size={16} color="#6b7280" />
                    <Text variant="bodySmall" style={styles.infoText} numberOfLines={1}>
                        {event.location}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 12,
    },
    cover: {
        height: 200,
    },
    content: {
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        flex: 1,
        fontWeight: 'bold',
    },
    chip: {
        marginLeft: 8,
    },
    description: {
        marginBottom: 12,
        color: '#6b7280',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    infoText: {
        flex: 1,
        color: '#6b7280',
    },
});
