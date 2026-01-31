import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import CreateGroupForm from '@/components/groups/CreateGroupForm';

export default function ModalScreen() {
  return (
    <>
      <CreateGroupForm />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  );
}
