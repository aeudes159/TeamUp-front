import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { GroupCard } from '@/components/groups/GroupCard';
import { useGroups } from '@/hooks/useGroups';
import { router } from 'expo-router';
import { Appbar, ActivityIndicator, Text, Surface, IconButton } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

export default function GroupsScreen() {
    const { data: groups, isLoading, error } = useGroups();
    const [scrollY] = useState(new Animated.Value(0));

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.8],
        extrapolate: 'clamp',
    });

    return (
        <Screen scrollable={false} style={{ backgroundColor: '#3A235A' }}>
            <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
                <Surface style={styles.headerSurface} elevation={0}>
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
                        <ActivityIndicator size="large" color="#B8A1D9" />
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
                        </Surface>
                    </View>
                )}

                {groups && groups.length === 0 && (
                    <View style={styles.centerContent}>
                        <Surface style={styles.emptyCard}>
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

                {groups && groups.length > 0 && (
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
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    headerSurface: {
        borderRadius: 28,
        backgroundColor: '#F6E6D8',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '500',
        color: '#F08A5D',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 28,
        fontFamily: 'System',
        fontWeight: '700',
        color: '#2E1A47',
        letterSpacing: -1,
        lineHeight: 32,
    },
    createButton: {
        borderRadius: 20,
        shadowColor: '#F08A5D',
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
        backgroundColor: '#F08A5D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonIcon: {
        fontSize: 24,
        fontWeight: '300',
        color: '#FFFFFF',
        lineHeight: 28,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#3A235A',
        paddingHorizontal: 24,
        paddingTop: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -16,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        fontFamily: 'System',
        fontWeight: '500',
        color: '#B8A1D9',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    errorCard: {
        borderRadius: 24,
        backgroundColor: '#F6E6D8',
        padding: 32,
        alignItems: 'center',
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    errorTitle: {
        fontSize: 20,
        fontFamily: 'System',
        fontWeight: '600',
        color: '#F08A5D',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    errorDetail: {
        fontSize: 15,
        fontFamily: 'System',
        fontWeight: '400',
        color: '#2E1A47',
        textAlign: 'center',
        lineHeight: 22,
        letterSpacing: 0.1,
    },
    emptyCard: {
        borderRadius: 28,
        backgroundColor: '#F6E6D8',
        padding: 40,
        alignItems: 'center',
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 12,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F6D186',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#F6D186',
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
        fontSize: 22,
        fontFamily: 'System',
        fontWeight: '600',
        color: '#2E1A47',
        marginBottom: 12,
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    emptyDetail: {
        fontSize: 15,
        fontFamily: 'System',
        fontWeight: '400',
        color: '#2E1A47',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
        letterSpacing: 0.1,
        paddingHorizontal: 8,
    },
    emptyButton: {
        borderRadius: 20,
        backgroundColor: '#B8A1D9',
        paddingHorizontal: 28,
        paddingVertical: 14,
        shadowColor: '#B8A1D9',
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
        fontFamily: 'System',
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    listContent: {
        paddingBottom: 40,
        paddingHorizontal: 8,
    },
    cardWrapper: {
        marginBottom: 20,
    },
});