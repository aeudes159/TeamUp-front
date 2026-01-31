import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Appbar, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { GroupAvatarPicker } from './GroupAvatarPicker';
import { GroupTypeSelector } from './GroupTypeSelector';
import { ParticipantSelector } from './ParticipantSelector';

type Participant = {
    id: string;
    name: string;
    email?: string;
};

export default function CreateGroupScreen() {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupAvatar, setGroupAvatar] = useState<string>();
    const [groupType, setGroupType] = useState<'public' | 'private'>('public');
    const [participants, setParticipants] = useState<Participant[]>([]);

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            return;
        }
        
        // TODO: Implement group creation logic
        console.log('Creating group:', { 
            name: groupName, 
            description: groupDescription,
            avatar: groupAvatar,
            type: groupType,
            participants: participants
        });
        
        // Navigate back to groups list
        router.back();
    };

    return (
        <Screen>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Créer un groupe" />
            </Appbar.Header>

            <ScrollView style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.title}>Nouveau groupe</Text>
                    
                    <GroupAvatarPicker
                        avatarUrl={groupAvatar}
                        onAvatarSelected={setGroupAvatar}
                    />
                    
                    <Input
                        label="Nom du groupe"
                        placeholder="Entrez le nom du groupe"
                        value={groupName}
                        onChangeText={setGroupName}
                    />

                    <GroupTypeSelector
                        value={groupType}
                        onValueChange={setGroupType}
                    />

                    <ParticipantSelector
                        participants={participants}
                        onParticipantsChange={setParticipants}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={handleCreateGroup}
                            disabled={!groupName.trim()}
                            style={styles.createButton}
                        >
                            Créer le groupe
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    form: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: 'System', // Using system font similar to SF Pro
        fontWeight: '600',
        color: '#2F2F38',
        marginBottom: 32,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    buttonContainer: {
        marginTop: 32,
        paddingHorizontal: 8,
    },
    createButton: {
        marginBottom: 16,
        borderRadius: 24,
        paddingVertical: 4,
    },
});