import { View, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { EventList } from '@/components/events/EventList';
import { mockEvents } from '@/mock/data';
import { useState } from 'react';
import { Appbar, FAB } from 'react-native-paper';

export default function FeedScreen() {
    const [events] = useState(mockEvents);

    return (
        <Screen scrollable={false}>
            <Appbar.Header>
                <Appbar.Content title="🎉 Événements" />
                <Appbar.Action icon="plus" onPress={() => {/* TODO: ouvrir modal création */}} />
            </Appbar.Header>

            <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
