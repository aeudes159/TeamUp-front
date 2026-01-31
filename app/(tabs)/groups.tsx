/**
 * Groups Screen
 * 
 * Displays user's groups with elegant animations and styling.
 * Uses the refactored useGroups hook with proper data access.
 */

import React, {useState} from 'react';
import {Animated, Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Screen} from '@/components/layout/Screen';
import {GroupCard} from '@/components/groups/GroupCard';
import {useGroups} from '@/hooks/useGroups';
import {router} from 'expo-router';
import {ActivityIndicator, Surface, Text} from 'react-native-paper';
import {borderRadius, colors, shadows, spacing, typography} from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export default function GroupsScreen() {
    const { data, isLoading, error, refetch } = useGroups();
    const [scrollY] = useState(new Animated.Value(0));

    // Extract the groups array from the paginated response
    const groups = data?.data ?? [];

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.8],
        extrapolate: 'clamp',
    });

    return (
        <Screen scrollable={false} style={{ backgroundColor: colors.background }}>
            <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
                <Surface style={[styles.headerSurface, shadows.soft]} elevation={0}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.title}>Mes Groupes</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => router.push('/modal')}
                            style={styles.createButton}
                            activeOpacity={0.7}
                        >
                            <View style={styles.createButtonInner}>
                                <Text style={styles.createButtonIcon}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Surface>
            </Animated.View>

            <View style={styles.contentContainer}>
                {isLoading && (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color={colors.lilac} />
                        <Text style={styles.loadingText}>Chargement de vos groupes...</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.centerContent}>
                        <Surface style={styles.errorCard}>
                            <Text style={styles.errorTitle}>Oups !</Text>
                            <Text style={styles.errorDetail}>
                                {error instanceof Error ? error.message : 'Une erreur est survenue'}
                            </Text>
                            <TouchableOpacity 
                                onPress={() => refetch()}
                                style={styles.retryButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.retryButtonText}>Réessayer</Text>
                            </TouchableOpacity>
                        </Surface>
                    </View>
                )}

                {!isLoading && !error && groups.length === 0 && (
                    <View style={styles.centerContent}>
                        <Surface style={[styles.emptyCard, shadows.soft]}>
                            <View style={styles.emptyIconContainer}>
                                <Text style={styles.emptyIcon}>🎨</Text>
                            </View>
                            <Text style={styles.emptyTitle}>Pas encore de groupes</Text>
                            <Text style={styles.emptyDetail}>Créez votre premier groupe pour commencer votre aventure créative</Text>
                            <TouchableOpacity 
                                onPress={() => router.push('/modal')}
                                style={styles.emptyButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.emptyButtonText}>Créer un groupe</Text>
                            </TouchableOpacity>
                        </Surface>
                    </View>
                )}

                {!isLoading && !error && groups.length > 0 && (
                    <Animated.FlatList
                        data={groups}
                        keyExtractor={(item) => String(item.id)}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                        renderItem={({ item, index }) => (
                            <Animated.View
                                style={[
                                    styles.cardWrapper,
                                    {
                                        transform: [{
                                            translateY: scrollY.interpolate({
                                                inputRange: [0, 100],
                                                outputRange: [0, Math.min(index * 10, 50)],
                                                extrapolate: 'clamp',
                                            })
                                        }]
                                    }
                                ]}
                            >
                                <GroupCard
                                    group={item}
                                    onPress={() => router.push(`/group/${item.id}`)}
                                />
                            </Animated.View>
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
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
        borderRadius: borderRadius.xl,
        backgroundColor: colors.card,
        padding: spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
        letterSpacing: -1,
        lineHeight: 32,
    },
    createButton: {
        borderRadius: 20,
        shadowColor: colors.coral,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    createButtonInner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.coral,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonIcon: {
        fontSize: 24,
        fontWeight: '300',
        color: colors.white,
        lineHeight: 28,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: colors.primary, // Using primary for the content background behind cards
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        marginTop: -16,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: 16,
        fontWeight: '500',
        color: colors.lilac,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    errorCard: {
        borderRadius: borderRadius.lg,
        backgroundColor: colors.card,
        padding: spacing.xl,
        alignItems: 'center',
        marginHorizontal: spacing.md,
        ...shadows.soft,
    },
    errorTitle: {
        ...typography.titleMedium,
        color: colors.coral,
        marginBottom: spacing.sm,
    },
    errorDetail: {
        ...typography.bodyMedium,
        textAlign: 'center',
        lineHeight: 22,
        letterSpacing: 0.1,
        marginBottom: 20,
    },
    retryButton: {
        borderRadius: 16,
        backgroundColor: '#F08A5D',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    retryButtonText: {
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    emptyCard: {
        borderRadius: borderRadius.xl,
        backgroundColor: colors.card,
        padding: 40,
        alignItems: 'center',
        marginHorizontal: spacing.md,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.yellow,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        shadowColor: colors.yellow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyTitle: {
        ...typography.titleLarge,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptyDetail: {
        ...typography.bodyMedium,
        textAlign: 'center',
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.sm,
    },
    emptyButton: {
        borderRadius: 20,
        backgroundColor: colors.lilac,
        paddingHorizontal: 28,
        paddingVertical: 14,
        shadowColor: colors.lilac,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    emptyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        letterSpacing: 0.5,
    },
    listContent: {
        paddingBottom: 40,
        paddingHorizontal: spacing.xs,
    },
    cardWrapper: {
        marginBottom: spacing.md,
    },
});
