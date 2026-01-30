import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';

type Group = {
    id: string;
    name: string;
    description: string;
    member_count: number;
};

type GroupCardProps = {
    group: Group;
    onPress?: () => void;
};

export function GroupCard({ group, onPress }: Readonly<GroupCardProps>) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card className="mb-3">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-lg font-bold mb-1">{group.name}</Text>
                        <Text className="text-gray-600 text-sm">{group.description}</Text>
                    </View>
                    <View className="bg-primary/10 px-3 py-1 rounded-full">
                        <Text className="text-primary font-semibold">
                            {group.member_count} 👥
                        </Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}