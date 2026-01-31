import React, {useState} from 'react';
import {Animated, Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Screen} from '@/components/layout/Screen';
import {Input} from '@/components/ui/Input';
import {Surface, Text} from 'react-native-paper';
import {router} from 'expo-router';
import {GroupAvatarPicker} from './GroupAvatarPicker';
import {GroupTypeSelector} from './GroupTypeSelector';
import {ParticipantSelector} from './ParticipantSelector';
import {useCreateGroup} from "@/hooks/useGroups";
import {borderRadius, colors, shadows, spacing, typography} from '@/constants/theme';

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

    const { mutate: createGroup } = useCreateGroup();

    const handleCreateGroup = () => {
        createGroup({
            name: groupName,
            coverPictureUrl: groupAvatar,
            isPublic: groupType == 'public',
        });
        router.back();
    };

    return (
        <Screen scrollable={false} style={{ backgroundColor: colors.background }}>
            <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
                <Surface style={[styles.headerSurface, shadows.soft]} elevation={0}>
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
                    <Surface style={[styles.contentSurface, shadows.soft]} elevation={0}>
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
                                style={{ backgroundColor: colors.white }}
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
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    headerSurface: {
        borderRadius: borderRadius.xl,
        backgroundColor: colors.card,
        padding: spacing.lg,
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
        backgroundColor: colors.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.coral,
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
        color: colors.coral,
    },
    headerText: {
        flex: 1,
    },
    subtitle: {
        ...typography.bodySmall,
        color: colors.coral,
        marginBottom: 4,
        letterSpacing: 0.5,
        fontWeight: '500',
    },
    title: {
        ...typography.titleLarge,
        color: colors.text,
        letterSpacing: -0.8,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        marginTop: -16,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 40,
    },
    contentSurface: {
        borderRadius: borderRadius.lg,
        backgroundColor: colors.card,
        padding: spacing.xl,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    formSection: {
        marginBottom: spacing.xl,
    },
    participantsSection: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    sectionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.yellow,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: colors.yellow,
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
        ...typography.titleMedium,
        letterSpacing: -0.4,
    },
    buttonContainer: {
        marginTop: 20,
    },
    createButton: {
        borderRadius: borderRadius.xl,
        backgroundColor: colors.lilac,
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: colors.lilac,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 12,
    },
    createButtonDisabled: {
        backgroundColor: colors.textLight,
        shadowOpacity: 0.1,
    },
    createButtonText: {
        ...typography.bodyLarge,
        fontWeight: '600',
        color: colors.white,
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
