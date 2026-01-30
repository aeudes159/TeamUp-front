import {FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {MessageBubble} from '@/components/groups/MessageBubble';
import {mockMessages, mockUser} from '@/mock/data';
import {useState} from 'react';
import {useLocalSearchParams} from 'expo-router';

export default function GroupChatScreen() {
    const {id} = useLocalSearchParams();
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now().toString(),
            group_id: id as string,
            user_id: mockUser.id,
            username: mockUser.username,
            avatar_url: mockUser.avatar_url,
            content: newMessage,
            created_at: new Date().toISOString()
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
            keyboardVerticalOffset={100}
        >
            <View className="flex-1 bg-gray-50">
                <View className="p-4 bg-white border-b border-gray-200">
                    <Text className="text-xl font-bold">Équipe Rouge 🔴</Text>
                    <Text className="text-sm text-gray-500">8 membres</Text>
                </View>

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <MessageBubble
                            message={item}
                            isCurrentUser={item.user_id === mockUser.id}
                        />
                    )}
                    inverted={false}
                />

                <View className="p-4 bg-white border-t border-gray-200 flex-row items-center">
                    <TextInput
                        className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-2"
                        placeholder="Votre message..."
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        className="bg-primary w-12 h-12 rounded-full items-center justify-center"
                    >
                        <Text className="text-white text-xl">🚀</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}