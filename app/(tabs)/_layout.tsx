import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform, Animated, View } from 'react-native';
import { useEffect, useRef } from 'react';

import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(props.focused ? 1.2 : 1)).current;
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: props.focused ? 1.2 : 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [props.focused, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <FontAwesome 
        size={28} 
        style={{ marginBottom: -3 }} 
        {...props} 
      />
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tabBarActive,
        tabBarInactiveTintColor: Colors['light'].tabBarInactive,
        tabBarStyle: {
          backgroundColor: Colors['light'].tabBarBackground,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderRadius: 25,
          marginHorizontal: 20,
          marginBottom: Platform.OS === 'ios' ? 20 : 10,
          height: 70,
          paddingBottom: 5,
          paddingTop: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Événements",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="calendar" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groupes',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="users" color={color} focused={focused} />,
        }}
      />
        <Tabs.Screen
            name="locations"
            options={{
                title: 'Lieux',
                tabBarIcon: ({ color, focused }) => <TabBarIcon name="map-marker" color={color} focused={focused} />,
            }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="user" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
