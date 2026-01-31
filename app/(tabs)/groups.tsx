import { View, FlatList, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { GroupCard } from '@/components/groups/GroupCard';
import { useGroups } from '@/hooks/useGroups';
import { router } from 'expo-router';
import { Appbar, ActivityIndicator, Text } from 'react-native-paper';

export default function GroupsScreen() {
    const { data: groups, isLoading, error } = useGroups();

    return (
        <Screen scrollable={false}>
            <Appbar.Header>
                <Appbar.Content title="Mes Groupes" />
            </Appbar.Header>

            <View style={styles.container}>
                {isLoading && (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" />
                        <Text style={styles.loadingText}>Loading groups...</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.centerContent}>
                        <Text style={styles.errorText}>Error loading groups</Text>
                        <Text style={styles.errorDetail}>
                            {error instanceof Error ? error.message : 'Unknown error'}
                        </Text>
                    </View>
                )}

                {groups && groups.length === 0 && (
                    <View style={styles.centerContent}>
                        <Text style={styles.emptyText}>No groups yet</Text>
                        <Text style={styles.emptyDetail}>Create or join a group to get started</Text>
                    </View>
                )}

                {groups && groups.length > 0 && (
                    <FlatList
                        data={groups}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <GroupCard
                                group={item}
                                onPress={() => router.push(`/group/${item.id}`)}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                )}
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
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#6b7280',
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ef4444',
    },
    errorDetail: {
        marginTop: 8,
        color: '#6b7280',
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6b7280',
    },
    emptyDetail: {
        marginTop: 8,
        color: '#9ca3af',
    },
});
