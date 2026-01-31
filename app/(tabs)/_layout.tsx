import React from 'react';
import {Tabs} from 'expo-router';
import TabBar from '@/components/navigation/TabBar';
import {useTheme} from 'react-native-paper';

import FontAwesome from "@expo/vector-icons/FontAwesome";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outline,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Actualités",
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
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
              title: 'Activités',
              tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
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
