import { TextInput, View, Text } from 'react-native';

type InputProps = {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    numberOfLines?: number;
    secureTextEntry?: boolean;
};

export function Input({
                          label,
                          placeholder,
                          value,
                          onChangeText,
                          multiline = false,
                          numberOfLines = 1,
                          secureTextEntry = false
                      }: Readonly<InputProps>) {
    return (
        <View className="mb-4">
            {label && <Text className="text-sm font-medium mb-2 text-gray-700">{label}</Text>}
            <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                numberOfLines={numberOfLines}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}