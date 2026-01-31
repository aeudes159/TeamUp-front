import { View, StyleSheet } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';

type GroupType = 'public' | 'private';

type GroupTypeSelectorProps = {
    value: GroupType;
    onValueChange: (value: GroupType) => void;
    disabled?: boolean;
};

export function GroupTypeSelector({ value, onValueChange, disabled }: Readonly<GroupTypeSelectorProps>) {
    const buttons = [
        {
            value: 'public' as const,
            label: 'Public',
            icon: 'earth',
            disabled: disabled || false,
        },
        {
            value: 'private' as const,
            label: 'Privé',
            icon: 'lock',
            disabled: disabled || false,
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Type de groupe</Text>
            <Text style={styles.description}>
                {value === 'public' 
                    ? 'Tout le monde peut rejoindre ce groupe' 
                    : 'Seuls les membres invités peuvent rejoindre'
                }
            </Text>
            <SegmentedButtons
                value={value}
                onValueChange={onValueChange}
                buttons={buttons}
                style={styles.segmentedButtons}
            />
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
        marginBottom: 8,
        color: '#2F2F38',
        letterSpacing: -0.2,
    },
    description: {
        fontSize: 15,
        fontFamily: 'System',
        fontWeight: '400',
        color: '#9A9AA5',
        marginBottom: 20,
        lineHeight: 22,
    },
    segmentedButtons: {
        backgroundColor: '#F2F2F5',
        borderRadius: 20,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 4,
    },
});