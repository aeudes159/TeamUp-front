import { Modal, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { colors, borderRadius, spacing, shadows, typography } from '@/constants/theme';
import { X } from 'lucide-react-native';
import { CommentsSection } from '@/components/comments/CommentsSection';
import { LocationCard } from './LocationCard';
import type { Location } from '@/types';

type LocationDetailsModalProps = {
    visible: boolean;
    onClose: () => void;
    location: Location | null;
    currentUserId: number;
};

export function LocationDetailsModal({
    visible,
    onClose,
    location,
    currentUserId,
}: Readonly<LocationDetailsModalProps>) {
    if (!location) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.backdrop} onPress={onClose} />
                    <Surface style={[styles.container, shadows.soft]} elevation={4}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Détails de l'activité</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.content}>
                            <View style={styles.cardContainer}>
                                <LocationCard 
                                    location={location} 
                                    showActions={false}
                                    onPress={() => {}} // Disable press
                                />
                            </View>
                            
                            <Text style={styles.sectionTitle}>Commentaires</Text>
                            
                            <CommentsSection 
                                targetId={location.id ?? 0} 
                                targetType="location" 
                                currentUserId={currentUserId} 
                            />
                        </View>
                    </Surface>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        backgroundColor: colors.card,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        height: '90%',
        paddingTop: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    title: {
        ...typography.titleMedium,
        color: colors.text,
    },
    closeButton: {
        padding: spacing.xs,
    },
    content: {
        flex: 1,
    },
    cardContainer: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.titleSmall,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
        color: colors.textSecondary,
    },
});
