import React from 'react';
import { Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import TabBar from '@/components/navigation/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: { display: 'none' }, // Cache la tab bar par défaut
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Événements",
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groupes',
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: 'Événements',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
        }}
      />
    </Tabs>
  );
}
