import { TextInput as PaperTextInput } from 'react-native-paper';

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
    secureTextEntry = false,
}: Readonly<InputProps>) {
    return (
        <PaperTextInput
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            numberOfLines={numberOfLines}
            secureTextEntry={secureTextEntry}
            mode="outlined"
            style={{ marginBottom: 16 }}
        />
    );
}
