import { View, FlatList, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { GroupCard } from '@/components/groups/GroupCard';
import { mockGroups } from '@/mock/data';
import { router } from 'expo-router';
import { Appbar } from 'react-native-paper';

export default function GroupsScreen() {
    return (
        <Screen scrollable={false}>
            <Appbar.Header>
                <Appbar.Content title="👥 Mes Groupes" />
            </Appbar.Header>

            <View style={styles.container}>
                <FlatList
                    data={mockGroups}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GroupCard
                            group={item}
                            onPress={() => router.push(`/group/${item.id}`)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    listContent: {
        flexGrow: 1,
    },
});
