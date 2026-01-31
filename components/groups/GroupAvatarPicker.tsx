import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable, Animated, Dimensions } from 'react-native';
import { IconButton, Text, Surface } from 'react-native-paper';
import { ImagePickerButton } from '@/components/chat/ImagePickerButton';

type GroupAvatarPickerProps = {
    avatarUrl?: string;
    onAvatarSelected: (avatarUrl: string) => void;
    disabled?: boolean;
};

const { width: screenWidth } = Dimensions.get('window');

export function GroupAvatarPicker({ avatarUrl, onAvatarSelected, disabled }: Readonly<GroupAvatarPickerProps>) {
    const [scaleAnim] = useState(new Animated.Value(1));
    const [opacityAnim] = useState(new Animated.Value(0));

    const handlePressIn = () => {
        if (disabled) return;
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();
    };

    const handlePressOut = () => {
        if (disabled) return;
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 3,
            tension: 40,
        }).start();
    };

    const handleAvatarSelected = (url: string) => {
        onAvatarSelected(url);
        // Success animation
        Animated.sequence([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                delay: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Photo du groupe</Text>
            
            <View style={styles.avatarContainer}>
                <Surface style={styles.avatarSurface} elevation={4}>
                    <Animated.View
                        style={[
                            styles.avatarTouchable,
                            {
                                transform: [{ scale: scaleAnim }],
                            }
                        ]}
                    >
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={() => {}}
                            disabled={disabled}
                            style={({ pressed }) => [
                                styles.avatarPressable,
                                pressed && styles.avatarPressed,
                                disabled && styles.avatarDisabled,
                            ]}
                        >
                            {avatarUrl ? (
                                <View style={styles.avatarWrapper}>
                                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                                    <View style={styles.editOverlay}>
                                        <ImagePickerButton
                                            onImageSelected={handleAvatarSelected}
                                            disabled={disabled}
                                        />
                                    </View>
                                    <Animated.View
                                        style={[
                                            styles.successIndicator,
                                            {
                                                opacity: opacityAnim,
                                            }
                                        ]}
                                    >
                                        <Text style={styles.successText}>✓</Text>
                                    </Animated.View>
                                </View>
                            ) : (
                                <View style={[styles.emptyState, disabled && styles.avatarDisabled]}>
                                    <View style={styles.iconContainer}>
                                        <IconButton
                                            icon="image-plus"
                                            size={50}
                                            iconColor="#8F88B8"
                                            style={styles.emptyIcon}
                                        />
                                    </View>
                                </View>
                            )}
                        </Pressable>
                    </Animated.View>
                </Surface>
                
                {avatarUrl && (
                    <View style={styles.actionButtons}>
                        <View style={styles.actionButton}>
                            <ImagePickerButton
                                onImageSelected={handleAvatarSelected}
                                disabled={disabled}
                            />
                        </View>
                    </View>
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
        marginBottom: 20,
        color: '#2F2F38',
        letterSpacing: -0.2,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    avatarSurface: {
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 12,
    },
    avatarTouchable: {
        position: 'relative',
    },
    avatarPressable: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarPressed: {
        opacity: 0.8,
    },
    avatarDisabled: {
        opacity: 0.4,
    },
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#E6E4F2',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    editOverlay: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#8F88B8',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },
    successIndicator: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    successText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyState: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'linear-gradient(135deg, #E6E4F2 0%, #F2F2F5 100%)',
        borderWidth: 2,
        borderColor: '#E6E4F2',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 8,
    },
    iconContainer: {
        marginBottom: 8,
    },
    emptyIcon: {
        margin: 0,
        backgroundColor: 'transparent',
    },
    emptyTitle: {
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '600',
        color: '#2F2F38',
        textAlign: 'center',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 11,
        fontFamily: 'System',
        fontWeight: '400',
        color: '#9A9AA5',
        textAlign: 'center',
        paddingHorizontal: 12,
        lineHeight: 14,
    },
    actionButtons: {
        position: 'absolute',
        bottom: -16,
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
});