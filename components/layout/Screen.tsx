import { ScrollView, View } from 'react-native';
import { ReactNode } from 'react';
import {SafeAreaView} from "react-native-safe-area-context";

type ScreenProps = {
    children: ReactNode;
    scrollable?: boolean;
    className?: string;
};

export function Screen({ children, scrollable = true, className = '' }: Readonly<ScreenProps>) {
    const Container = scrollable ? ScrollView : View;

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Container className={`flex-1 ${className}`}>
                {children}
            </Container>
        </SafeAreaView>
    );
}