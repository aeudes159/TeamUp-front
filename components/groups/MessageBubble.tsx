import { View, Text, Image } from 'react-native';

type Message = {
    id: string;
    username: string;
    avatar_url: string;
    content: string;
    created_at: string;
    user_id: string;
};

type MessageBubbleProps = {
    message: Message;
    isCurrentUser?: boolean;
};

export function MessageBubble({ message, isCurrentUser = false }: Readonly<MessageBubbleProps>) {
    return (
        <View className={`flex-row mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {!isCurrentUser && (
                <Image
                    source={{ uri: message.avatar_url }}
                    className="w-8 h-8 rounded-full mr-2"
                />
            )}

            <View className={`max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                {!isCurrentUser && (
                    <Text className="text-xs text-gray-500 mb-1 ml-2">{message.username}</Text>
                )}

                <View className={`rounded-2xl px-4 py-3 ${
                    isCurrentUser
                        ? 'bg-primary'
                        : 'bg-gray-200'
                }`}>
                    <Text className={isCurrentUser ? 'text-white' : 'text-gray-800'}>
                        {message.content}
                    </Text>
                </View>

                <Text className="text-xs text-gray-400 mt-1 mx-2">
                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            </View>

            {isCurrentUser && (
                <Image
                    source={{ uri: message.avatar_url }}
                    className="w-8 h-8 rounded-full ml-2"
                />
            )}
        </View>
    );
}