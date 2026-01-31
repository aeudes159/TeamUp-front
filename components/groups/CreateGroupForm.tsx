import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Appbar, Text, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { GroupAvatarPicker } from './GroupAvatarPicker';
import { GroupTypeSelector } from './GroupTypeSelector';
import { ParticipantSelector } from './ParticipantSelector';

type Participant = {
    id: string;
    name: string;
    email?: string;
};

const { width: screenWidth } = Dimensions.get('window');

export default function CreateGroupScreen() {
    const [groupName, setGroupName] = useState('');
    const [groupAvatar, setGroupAvatar] = useState<string>();
    const [groupType, setGroupType] = useState<'public' | 'private'>('public');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [scrollY] = useState(new Animated.Value(0));

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            return;
        }
        
        console.log('Creating group:', { 
            name: groupName, 
            avatar: groupAvatar,
            type: groupType,
            participants: participants
        });
        
        router.back();
    };

    return (
        <Screen scrollable={false} style={{ backgroundColor: '#3A235A' }}>
            <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
                <Surface style={styles.headerSurface} elevation={0}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <View style={styles.headerText}>
                            <Text style={styles.subtitle}>Création</Text>
                            <Text style={styles.title}>Nouveau Groupe</Text>
                        </View>
                    </View>
                </Surface>
            </Animated.View>

            <View style={styles.contentContainer}>
                <Animated.ScrollView
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Background Surface pour tout le contenu */}
                    <Surface style={styles.contentSurface}>
                        {/* Avatar Section - Centrée en haut */}
                        <View style={styles.avatarSection}>
                            <GroupAvatarPicker
                                avatarUrl={groupAvatar}
                                onAvatarSelected={setGroupAvatar}
                            />
                        </View>

                        {/* Form Section */}
                        <View style={styles.formSection}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIconContainer}>
                                    <Text style={styles.sectionIcon}>📝</Text>
                                </View>
                                <Text style={styles.sectionTitle}>Informations</Text>
                            </View>
                            
                            <Input
                                label="Nom du groupe"
                                placeholder="Donnez un nom à votre groupe"
                                value={groupName}
                                onChangeText={setGroupName}
                            />

                            <GroupTypeSelector
                                value={groupType}
                                onValueChange={setGroupType}
                            />

                        </View>

                        {/* Participants Section */}
                        <View style={styles.participantsSection}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIconContainer}>
                                    <Text style={styles.sectionIcon}>👥</Text>
                                </View>
                                <Text style={styles.sectionTitle}>Participants</Text>
                            </View>
                            
                            <ParticipantSelector
                                participants={participants}
                                onParticipantsChange={setParticipants}
                            />
                        </View>

                        <View style={styles.bottomSpacer} />
                    </Surface>

                    {/* Create Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={handleCreateGroup}
                            disabled={!groupName.trim()}
                            style={[
                                styles.createButton,
                                !groupName.trim() && styles.createButtonDisabled
                            ]}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.createButtonText}>Créer le groupe</Text>
                            <View style={styles.createButtonIcon}>
                                <Text style={styles.createIcon}>✨</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSpacer} />
                </Animated.ScrollView>
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
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3D1C8',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F08A5D',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    backIcon: {
        fontSize: 20,
        fontWeight: '600',
        color: '#F08A5D',
    },
    headerText: {
        flex: 1,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '500',
        color: '#F08A5D',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 24,
        fontFamily: 'System',
        fontWeight: '700',
        color: '#2E1A47',
        letterSpacing: -0.8,
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
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 40,
    },
    contentSurface: {
        borderRadius: 24,
        backgroundColor: '#F6E6D8',
        padding: 32,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    formSection: {
        marginBottom: 32,
    },
    participantsSection: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F6D186',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#F6D186',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    sectionIcon: {
        fontSize: 18,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'System',
        fontWeight: '600',
        color: '#2E1A47',
        letterSpacing: -0.4,
    },
    buttonContainer: {
        marginTop: 20,
    },
    createButton: {
        borderRadius: 24,
        backgroundColor: '#B8A1D9',
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#B8A1D9',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 12,
    },
    createButtonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0.1,
    },
    createButtonText: {
        fontSize: 18,
        fontFamily: 'System',
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.3,
        flex: 1,
        textAlign: 'center',
    },
    createButtonIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createIcon: {
        fontSize: 16,
    },
    bottomSpacer: {
        height: 20,
    },
});