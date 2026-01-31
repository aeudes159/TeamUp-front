import { View, Image, StyleSheet, Animated } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockUser } from '@/mock/data';
import { Text, Divider, useTheme, Surface } from 'react-native-paper';
import { colors, shadows, borderRadius, spacing } from '@/constants/theme';
import { useState } from 'react';
import { LogOut, Edit2 } from 'lucide-react-native';

export default function ProfileScreen() {
    const theme = useTheme();
    const [scrollY] = useState(new Animated.Value(0));

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.8],
        extrapolate: 'clamp',
    });
    
    return (
        <Screen scrollable={false} style={{ backgroundColor: colors.background }}>
            <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
                <Surface style={[styles.headerSurface, shadows.soft]} elevation={0}>
                    <Text style={[styles.title, { color: colors.text }]}>Profil</Text>
                </Surface>
            </Animated.View>

            <Animated.ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <Card style={styles.profileCard}>
                    <Image
                        source={{ uri: mockUser.avatar_url }}
                        style={styles.avatar}
                    />
                    <Text variant="headlineMedium" style={styles.username}>{mockUser.username}</Text>
                    <Text variant="bodyMedium" style={styles.email}>{mockUser.email}</Text>
                    <Text variant="bodySmall" style={styles.bio}>{mockUser.bio}</Text>
                </Card>

                <Card style={styles.statsCard}>
                    <Text variant="titleMedium" style={styles.statsTitle}>📊 Statistiques</Text>
                    <Divider style={styles.divider} />
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>12</Text>
                            <Text variant="bodySmall" style={styles.statLabel}>Événements</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>5</Text>
                            <Text variant="bodySmall" style={styles.statLabel}>Groupes</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>43</Text>
                            <Text variant="bodySmall" style={styles.statLabel}>Messages</Text>
                        </View>
                    </View>
                </Card>

                <View style={styles.actionButtons}>
                    <Button 
                        onPress={() => console.log('Modifier profil')} 
                        style={styles.button}
                        icon="pencil"
                        variant="secondary"
                    >
                        Modifier le profil
                    </Button>

                    <Button 
                        variant="destructive" 
                        onPress={() => console.log('Déconnexion')} 
                        style={styles.button}
                        icon="logout"
                    >
                        Se déconnecter
                    </Button>
                </View>
            </Animated.ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 16,
        paddingHorizontal: 24,
        paddingBottom: 8,
    },
    headerSurface: {
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        backgroundColor: colors.card,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
        color: colors.text,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    profileCard: {
        alignItems: 'center',
        marginBottom: 16,
        padding: 24,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        marginBottom: 16,
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        color: '#6b7280',
        marginBottom: 16,
    },
    bio: {
        textAlign: 'center',
        color: '#374151',
    },
    statsCard: {
        marginBottom: 24,
        padding: 16,
    },
    statsTitle: {
        fontWeight: '600',
        marginBottom: 12,
    },
    divider: {
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: '#6b7280',
        marginTop: 4,
    },
    actionButtons: {
        marginTop: 8,
        gap: 12,
        paddingBottom: 40,
    },
    button: {
        width: '100%',
    },
});
