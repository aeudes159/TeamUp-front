import { ReactNode } from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';

type ButtonProps = {
    onPress: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};

export function Button({
    onPress,
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
}: Readonly<ButtonProps>) {
    const mode = variant === 'outline' ? 'outlined' : 'contained';
    
    const buttonColor = variant === 'secondary' ? 'secondary' : undefined;

    const contentStyle = {
        paddingVertical: size === 'sm' ? 4 : size === 'lg' ? 12 : 8,
    };

    return (
        <PaperButton
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled}
            buttonColor={buttonColor}
            contentStyle={contentStyle}
            style={style}
        >
            {children}
        </PaperButton>
    );
}
