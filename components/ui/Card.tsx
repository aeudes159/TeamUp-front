import { ReactNode } from 'react';
import { Card as PaperCard } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows } from '@/constants/theme';

type CardProps = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    variant?: 'default' | 'elevated' | 'outlined';
};

export function Card({ children, style, onPress, variant = 'default' }: Readonly<CardProps>) {
    const cardShadow = variant === 'elevated' ? shadows.soft : undefined;
    const borderColor = variant === 'outlined' ? colors.cardLight : undefined;
    const borderWidth = variant === 'outlined' ? 1 : 0;

    return (
        <PaperCard 
            style={[
                {
                    backgroundColor: colors.card,
                    borderRadius: borderRadius.lg,
                    borderWidth: borderWidth,
                    borderColor: borderColor,
                },
                cardShadow,
                style
            ]} 
            onPress={onPress}
            elevation={variant === 'elevated' ? 4 : 0}
        >
            <PaperCard.Content>
                {children}
            </PaperCard.Content>
        </PaperCard>
    );
}
