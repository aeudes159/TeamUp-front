import { ScrollView, View, StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Surface } from 'react-native-paper';

type ScreenProps = {
    children: ReactNode;
    scrollable?: boolean;
    style?: StyleProp<ViewStyle>;
};

export function Screen({ children, scrollable = true, style }: Readonly<ScreenProps>) {
    const Container = scrollable ? ScrollView : View;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Surface style={{ flex: 1 }}>
                <Container style={[{ flex: 1 }, style]} contentContainerStyle={scrollable ? { flexGrow: 1 } : undefined}>
                    {children}
                </Container>
            </Surface>
        </SafeAreaView>
    );
}
