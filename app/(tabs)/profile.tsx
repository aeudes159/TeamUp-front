import { View, Image, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockUser } from '@/mock/data';
import { Text, Divider, useTheme } from 'react-native-paper';

export default function ProfileScreen() {
    const theme = useTheme();
    
    return (
        <Screen>
            <View style={styles.container}>
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

                <Button onPress={() => console.log('Modifier profil')} style={styles.button}>
                    ✏️ Modifier le profil
                </Button>

                <Button variant="outline" onPress={() => console.log('Déconnexion')} style={styles.button}>
                    🚪 Se déconnecter
                </Button>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
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
        marginBottom: 16,
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
    button: {
        marginBottom: 12,
    },
});
