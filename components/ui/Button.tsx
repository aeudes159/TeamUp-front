import { ReactNode } from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, typography } from '@/constants/theme';

type ButtonProps = {
    onPress: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    icon?: string;
};

export function Button({
    onPress,
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    icon,
}: Readonly<ButtonProps>) {
    const mode = (variant === 'outline' || variant === 'destructive') ? 'outlined' : variant === 'ghost' ? 'text' : 'contained';
    
    // Determine button colors based on variant
    let buttonColor: string | undefined;
    let textColor: string | undefined;
    
    switch (variant) {
        case 'primary':
            buttonColor = colors.primary;
            textColor = colors.white;
            break;
        case 'secondary':
            buttonColor = colors.lilac;
            textColor = colors.white;
            break;
        case 'outline':
            buttonColor = undefined;
            textColor = colors.primary;
            break;
        case 'ghost':
            buttonColor = undefined;
            textColor = colors.primary;
            break;
        case 'destructive':
            buttonColor = undefined;
            textColor = colors.coral;
            break;
    }

    // Determine padding based on size
    const verticalPadding = size === 'sm' ? 4 : size === 'lg' ? 12 : 8;
    const horizontalPadding = size === 'sm' ? 16 : size === 'lg' ? 32 : 24;

    const buttonShadow = variant === 'primary' ? shadows.soft : variant === 'secondary' ? shadows.artistic : variant === 'destructive' ? shadows.soft : undefined;

    return (
        <PaperButton
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled}
            buttonColor={buttonColor}
            textColor={textColor}
            icon={icon}
            contentStyle={{
                paddingVertical: verticalPadding,
                paddingHorizontal: horizontalPadding,
            }}
            labelStyle={{
                ...typography.bodyMedium,
                fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
                fontWeight: '600',
                letterSpacing: 0.5,
                color: textColor, // Force color to ensure contrast
            }}
            style={[
                {
                    borderRadius: borderRadius.pill,
                    borderColor: variant === 'outline' ? colors.primary : variant === 'destructive' ? colors.coral : undefined,
                },
                !disabled && buttonShadow,
                style,
            ]}
        >
            {children}
        </PaperButton>
    );
}
