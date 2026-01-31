import { View, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { ImagePickerButton } from '@/components/chat/ImagePickerButton';

type GroupAvatarPickerProps = {
    avatarUrl?: string;
    onAvatarSelected: (avatarUrl: string) => void;
    disabled?: boolean;
};

export function GroupAvatarPicker({ avatarUrl, onAvatarSelected, disabled }: Readonly<GroupAvatarPickerProps>) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Photo du groupe</Text>
            <View style={styles.avatarContainer}>
                {avatarUrl ? (
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                        <Pressable style={styles.editOverlay} onPress={() => {}}>
                            <IconButton
                                icon="camera"
                                size={18}
                                iconColor="#FFFFFF"
                                style={styles.editIconButton}
                            />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable 
                        style={[styles.avatarPlaceholder, disabled && styles.avatarDisabled]}
                        onPress={() => {}}
                    >
                        <IconButton
                            icon="plus"
                            size={32}
                            iconColor="#8F88B8"
                            style={styles.addButton}
                        />
                        <Text style={styles.placeholderText}>Ajouter une photo</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 32,
    },
    label: {
        fontSize: 17,
        fontFamily: 'System',
        fontWeight: '600',
        marginBottom: 16,
        color: '#2F2F38',
        letterSpacing: -0.2,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarTouchable: {
        position: 'relative',
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#E6E4F2',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 8,
    },
    editOverlay: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: '#8F88B8',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    editIconButton: {
        margin: 0,
    },
    addButton: {
        margin: 0,
        backgroundColor: 'transparent',
    },
    avatarPlaceholder: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#E6E4F2',
        borderWidth: 2,
        borderColor: '#F2F2F5',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 8,
    },
    avatarDisabled: {
        opacity: 0.4,
    },
    placeholderText: {
        fontSize: 12,
        fontFamily: 'System',
        fontWeight: '500',
        color: '#9A9AA5',
        marginTop: 8,
        textAlign: 'center',
    },
});