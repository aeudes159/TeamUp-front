import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
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
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {}}
                disabled={disabled}
                activeOpacity={0.8}
                style={styles.avatarContainer}
            >
                <Animated.View
                    style={[
                        styles.avatarTouchable,
                        {
                            transform: [{ scale: scaleAnim }],
                        }
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
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconContainer}>
                                <Text style={styles.emptyIcon}>📷</Text>
                            </View>
                            <Text style={styles.emptyText}>Photo du groupe</Text>
                        </View>
                    )}
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    avatarTouchable: {
        position: 'relative',
    },
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#F3D1C8',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
    },
    editOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F08A5D',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#F6E6D8',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    successIndicator: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    successText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyState: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'linear-gradient(135deg, #B8A1D9 0%, #F6E6D8 100%)',
        borderWidth: 3,
        borderColor: '#F3D1C8',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 10,
    },
    emptyIconContainer: {
        marginBottom: 8,
    },
    emptyIcon: {
        fontSize: 40,
        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '600',
        color: '#2E1A47',
        textAlign: 'center',
        letterSpacing: -0.2,
    },
});