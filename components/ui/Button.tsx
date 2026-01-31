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
            buttonColor={buttonColor || '#8F88B8'}
            textColor="#FFFFFF"
            contentStyle={{
                ...contentStyle,
                paddingHorizontal: 24,
                paddingVertical: 12,
            }}
            style={[
                {
                    borderRadius: 24,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 6,
                    },
                    shadowOpacity: 0.08,
                    shadowRadius: 20,
                    elevation: 8,
                },
                style,
            ]}
        >
            {children}
        </PaperButton>
    );
}
