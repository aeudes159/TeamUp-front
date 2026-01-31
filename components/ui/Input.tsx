import { TextInput as PaperTextInput } from 'react-native-paper';
import { colors, borderRadius, typography } from '@/constants/theme';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

type InputProps = {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    numberOfLines?: number;
    secureTextEntry?: boolean;
    style?: StyleProp<TextStyle>;
    right?: React.ReactNode;
};

export function Input({
    label,
    placeholder,
    value,
    onChangeText,
    multiline = false,
    numberOfLines = 1,
    secureTextEntry = false,
    style,
    right,
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
            right={right}
            style={[
                { 
                    marginBottom: 20,
                    backgroundColor: colors.white, // Use white for better contrast on colored backgrounds
                    fontSize: 16,
                },
                style
            ]}
            outlineStyle={{
                borderRadius: borderRadius.md,
                borderColor: colors.cardLight,
            }}
            contentStyle={{
                ...typography.bodyLarge,
                color: colors.text,
            }}
            theme={{
                colors: {
                    primary: colors.primary,
                    background: colors.white,
                    onSurface: colors.textSecondary,
                    outline: colors.cardLight,
                    outlineVariant: colors.cardLight,
                    surfaceVariant: colors.white,
                },
                roundness: borderRadius.md,
            }}
        />
    );
}
