import { View, StyleSheet, ScrollView } from 'react-native';
import { IconButton, Text, Chip } from 'react-native-paper';
import { useState } from 'react';

type Participant = {
    id: string;
    name: string;
    email?: string;
};

type ParticipantSelectorProps = {
    participants: Participant[];
    onParticipantsChange: (participants: Participant[]) => void;
    disabled?: boolean;
};

// Mock data for demonstration - replace with actual user search
const mockUsers: Participant[] = [
    { id: '1', name: 'Alice Martin', email: 'alice@example.com' },
    { id: '2', name: 'Bob Dupont', email: 'bob@example.com' },
    { id: '3', name: 'Claire Bernard', email: 'claire@example.com' },
    { id: '4', name: 'David Petit', email: 'david@example.com' },
    { id: '5', name: 'Emma Leroy', email: 'emma@example.com' },
];

export function ParticipantSelector({ participants, onParticipantsChange, disabled }: Readonly<ParticipantSelectorProps>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredUsers = mockUsers.filter(user => 
        !participants.some(p => p.id === user.id) &&
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const addParticipant = (user: Participant) => {
        onParticipantsChange([...participants, user]);
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const removeParticipant = (userId: string) => {
        onParticipantsChange(participants.filter(p => p.id !== userId));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Participants</Text>
            
            <View style={styles.participantsList}>
                {participants.map((participant) => (
                    <Chip
                        key={participant.id}
                        onClose={() => removeParticipant(participant.id)}
                        disabled={disabled}
                        style={styles.chip}
                    >
                        {participant.name}
                    </Chip>
                ))}
                
                <IconButton
                    icon="plus"
                    size={20}
                    onPress={() => setShowSuggestions(true)}
                    disabled={disabled}
                    style={styles.addButton}
                />
            </View>

            {showSuggestions && (
                <View style={styles.suggestionsContainer}>
                    <ScrollView style={styles.suggestionsList}>
                        {filteredUsers.map((user) => (
                            <View key={user.id} style={styles.suggestionItem}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    {user.email && (
                                        <Text style={styles.userEmail}>{user.email}</Text>
                                    )}
                                </View>
                                <IconButton
                                    icon="plus"
                                    size={20}
                                    onPress={() => addParticipant(user)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                    
                    <IconButton
                        icon="close"
                        size={20}
                        onPress={() => {
                            setShowSuggestions(false);
                            setSearchQuery('');
                        }}
                        style={styles.closeButton}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    participantsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        minHeight: 48,
        paddingVertical: 8,
    },
    chip: {
        marginBottom: 0,
        backgroundColor: '#E6E4F2',
        borderRadius: 20,
    },
    addButton: {
        margin: 0,
        height: 36,
        width: 36,
        borderRadius: 18,
        backgroundColor: '#F2F2F5',
    },
    suggestionsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F2F2F5',
        maxHeight: 220,
        marginTop: 12,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 8,
    },
    suggestionsList: {
        maxHeight: 180,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#FAFAFA',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontFamily: 'System',
        fontWeight: '500',
        color: '#2F2F38',
    },
    userEmail: {
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '400',
        color: '#9A9AA5',
        marginTop: 4,
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        margin: 0,
        height: 28,
        width: 28,
        borderRadius: 14,
        backgroundColor: '#F2F2F5',
    },
});