import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {ReactNode} from 'react';

type ButtonProps = {
    onPress: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
};

export function Button({
                           onPress,
                           children,
                           variant = 'primary',
                           size = 'md',
                           loading = false,
                           disabled = false
                       }: Readonly<ButtonProps>) {
    const baseClasses = 'rounded-lg items-center justify-center flex-row';

    const variantClasses = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        outline: 'border-2 border-primary bg-transparent'
    };

    const sizeClasses = {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4'
    };

    const textClasses = {
        primary: 'text-white font-semibold',
        secondary: 'text-white font-semibold',
        outline: 'text-primary font-semibold'
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
                disabled ? 'opacity-50' : ''
            }`}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#6366f1' : '#fff'}/>
            ) : (
                <Text className={textClasses[variant]}>{children}</Text>
            )}
        </TouchableOpacity>
    );
}