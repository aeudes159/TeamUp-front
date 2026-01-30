import { View } from 'react-native';
import { ReactNode } from 'react';

type CardProps = {
    children: ReactNode;
    className?: string;
};

export function Card({ children, className = '' }: Readonly<CardProps>) {
    return (
        <View className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
            {children}
        </View>
    );
}