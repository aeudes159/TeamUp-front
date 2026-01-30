import { ReactNode } from 'react';
import { Card as PaperCard } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';

type CardProps = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
};

export function Card({ children, style, onPress }: Readonly<CardProps>) {
    if (onPress) {
        return (
            <PaperCard style={style} onPress={onPress}>
                <PaperCard.Content>
                    {children}
                </PaperCard.Content>
            </PaperCard>
        );
    }

    return (
        <PaperCard style={style}>
            <PaperCard.Content>
                {children}
            </PaperCard.Content>
        </PaperCard>
    );
}
