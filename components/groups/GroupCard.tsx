import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, Avatar, Chip } from 'react-native-paper';
import { colors, shadows, borderRadius, typography, spacing } from '@/constants/theme';
import type { GroupCardProps } from '@/types';
import { Users, Lock, Globe } from 'lucide-react-native';

export function GroupCard({ group, onPress }: Readonly<GroupCardProps>) {
    return (
        <Surface style={[styles.card, shadows.soft]} elevation={0}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.touchable}>
                <View style={styles.container}>
                    {group.coverPictureUrl ? (
                        <Avatar.Image
                            source={{ uri: group.coverPictureUrl }}
                            size={64}
                            style={styles.avatar}
                        />
                    ) : (
                        <Avatar.Icon
                            icon="account-group"
                            size={64}
                            style={styles.avatar}
                            color={colors.white}
                        />
                    )}
                    
                    <View style={styles.contentContainer}>
                        <View style={styles.headerRow}>
                            <Text style={[typography.titleMedium, styles.name]} numberOfLines={1}>
                                {group.name}
                            </Text>
                            {group.isPublic !== undefined && (
                                <View style={styles.typeIcon}>
                                    {group.isPublic ? (
                                        <Globe size={16} color={colors.textSecondary} />
                                    ) : (
                                        <Lock size={16} color={colors.textSecondary} />
                                    )}
                                </View>
                            )}
                        </View>
                        
                        {group.description && (
                            <Text style={[typography.bodySmall, styles.description]} numberOfLines={2}>
                                {group.description}
                            </Text>
                        )}

                        <View style={styles.footerRow}>
                            <View style={styles.memberCount}>
                                <Users size={14} color={colors.textSecondary} />
                                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                                    {group.memberCount || 0} members
                                </Text>
                            </View>
                            
                            {group.createdAt && (
                                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                                    {new Date(group.createdAt).toLocaleDateString()}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Surface>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.card,
        overflow: 'hidden',
    },
    touchable: {
        padding: spacing.md,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        backgroundColor: colors.lilac,
    },
    contentContainer: {
        flex: 1,
        marginLeft: spacing.md,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        color: colors.text,
        flex: 1,
        marginRight: spacing.sm,
    },
    typeIcon: {
        opacity: 0.7,
    },
    description: {
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    memberCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});
