import { View, Text, Image } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockUser } from '@/mock/data';

export default function ProfileScreen() {
    return (
        <Screen className="flex-1">
            <View className="p-4 flex-1">
                <Card className="items-center mb-6">
                    <Image
                        source={{ uri: mockUser.avatar_url }}
                        className="w-24 h-24 rounded-full mb-4"
                    />
                    <Text className="text-2xl font-bold mb-2">{mockUser.username}</Text>
                    <Text className="text-gray-600 mb-4">{mockUser.email}</Text>
                    <Text className="text-center text-gray-700">{mockUser.bio}</Text>
                </Card>

                <Card className="mb-4">
                    <Text className="font-semibold text-lg mb-3">📊 Statistiques</Text>
                    <View className="flex-row justify-around">
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-primary">12</Text>
                            <Text className="text-gray-600">Événements</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-primary">5</Text>
                            <Text className="text-gray-600">Groupes</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-primary">43</Text>
                            <Text className="text-gray-600">Messages</Text>
                        </View>
                    </View>
                </Card>

                <Button onPress={() => console.log('Modifier profil')}>
                    ✏️ Modifier le profil
                </Button>

                <View className="mt-4">
                    <Button variant="outline" onPress={() => console.log('Déconnexion')}>
                        🚪 Se déconnecter
                    </Button>
                </View>
            </View>
        </Screen>
    );
}