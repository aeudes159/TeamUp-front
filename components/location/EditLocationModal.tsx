import { Modal, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, borderRadius, spacing, shadows, typography } from '@/constants/theme';
import { X } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import type { Location, NewLocation } from '@/types';

type EditLocationModalProps = {
    visible: boolean;
    onClose: () => void;
    onUpdateLocation: (id: number, location: Partial<NewLocation>) => void;
    isLoading: boolean;
    location: Location | null;
};

export function EditLocationModal({
    visible,
    onClose,
    onUpdateLocation,
    isLoading,
    location,
}: Readonly<EditLocationModalProps>) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [averagePrice, setAveragePrice] = useState('');
    const [pictureUrl, setPictureUrl] = useState('');

    useEffect(() => {
        if (location) {
            setName(location.name || '');
            setAddress(location.address || '');
            setAveragePrice(location.averagePrice?.toString() || '');
            setPictureUrl(location.pictureUrl || '');
        }
    }, [location]);

    const handleSubmit = () => {
        if (!name.trim() || !location?.id) return;

        onUpdateLocation(location.id, {
            name,
            address,
            averagePrice: averagePrice ? parseFloat(averagePrice) : undefined,
            pictureUrl: pictureUrl || undefined,
        });
    };

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
                    <Surface style={[styles.container, shadows.soft]} elevation={4}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Edit Location</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.content}>
                            <Input
                                placeholder="Location Name"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                            />
                            <Input
                                placeholder="Address"
                                value={address}
                                onChangeText={setAddress}
                                style={styles.input}
                            />
                            <Input
                                placeholder="Average Price (€)"
                                value={averagePrice}
                                onChangeText={setAveragePrice}
                                style={styles.input}
                            />
                             <Input
                                placeholder="Image URL (optional)"
                                value={pictureUrl}
                                onChangeText={setPictureUrl}
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Button
                                onPress={handleSubmit}
                                loading={isLoading}
                                disabled={!name.trim() || isLoading}
                                size="md"
                                style={styles.submitButton}
                            >
                                Save Changes
                            </Button>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.card,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
        paddingBottom: Platform.OS === 'ios' ? 40 : spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        marginBottom: spacing.md,
    },
    input: {
        backgroundColor: colors.white,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    submitButton: {
        width: '100%',
    }
});
