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
            style={{ 
                marginBottom: 20,
                backgroundColor: '#FAFAFA',
                borderRadius: 16,
                fontSize: 16,
                fontFamily: 'System',
            }}
            theme={{
                colors: {
                    primary: '#8F88B8',
                    background: '#FAFAFA',
                    onSurface: '#9A9AA5',
                    outline: '#E6E4F2',
                },
            }}
        />
    );
}
