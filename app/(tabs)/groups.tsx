import { View, Text, FlatList } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { GroupCard } from '@/components/groups/GroupCard';
import { mockGroups } from '@/mock/data';
import { router } from 'expo-router';

export default function GroupsScreen() {
    return (
        <Screen scrollable={false} className="flex-1">
            <View className="p-4 bg-white border-b border-gray-200">
                <Text className="text-2xl font-bold">👥 Mes Groupes</Text>
            </View>

            <View className="flex-1">
                <FlatList
                    data={mockGroups}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GroupCard
                            group={item}
                            onPress={() => router.push(`/group/${item.id}`)}
                        />
                    )}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>
        </Screen>
    );
}