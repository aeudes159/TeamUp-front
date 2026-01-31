import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors: themeColors } = useTheme();
  const [animatedValues] = React.useState(
    state.routes.map(() => new Animated.Value(1))
  );
  const [scaleAnimations] = React.useState(
    state.routes.map(() => new Animated.Value(1))
  );

  React.useEffect(() => {
    // Animation de l'onglet actif au montage et au changement
    state.routes.forEach((_: any, index: number) => {
      const isFocused = state.index === index;
      Animated.spring(scaleAnimations[index], {
        toValue: isFocused ? 1.1 : 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  const handlePress = (route: any, index: number) => {
    const isFocused = state.index === index;
    
    if (isFocused) {
      // Animation de rebond si déjà actif
      Animated.sequence([
        Animated.timing(animatedValues[index], {
          toValue: 0.9,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(animatedValues[index], {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    // Animation d'appui avec rebond naturel
    Animated.sequence([
      Animated.timing(animatedValues[index], {
        toValue: 0.85,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValues[index], {
        toValue: 1.15,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValues[index], {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const getIconName = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'calendar';
      case 'groups':
        return 'users';
      case 'locations':
        return 'gamepad';
      case 'profile':
        return 'user';
      default:
        return 'circle';
    }
  };

  const getTabTitle = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Événements';
      case 'groups':
        return 'Groupes';
      case 'locations':
        return 'Événements';
      case 'profile':
        return 'Profil';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          
          const iconColor = isFocused ? Colors.light.tabIconSelected : Colors.light.tabIconDefault;
          const textColor = isFocused ? Colors.light.text : Colors.light.tabIconDefault;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => handlePress(route, index)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  {
                    transform: [
                      { scale: Animated.multiply(animatedValues[index], scaleAnimations[index]) }
                    ],
                  },
                ]}
              >
                <Animated.View 
                  style={[
                    styles.iconContainer, 
                    isFocused && styles.iconContainerFocused,
                    {
                      backgroundColor: isFocused ? Colors.light.accent + '25' : 'transparent',
                      transform: [{ scale: scaleAnimations[index] }],
                    }
                  ]}
                >
                  <FontAwesome
                    name={getIconName(route.name)}
                    size={24}
                    color={iconColor}
                    style={styles.icon}
                  />
                </Animated.View>
                <Animated.Text 
                  style={[
                    styles.label, 
                    { 
                      color: textColor,
                      opacity: scaleAnimations[index].interpolate({
                        inputRange: [1, 1.1],
                        outputRange: [0.7, 1],
                      }),
                    }
                  ]}
                >
                  {getTabTitle(route.name)}
                </Animated.Text>
                {isFocused && (
                  <Animated.View 
                    style={[
                      styles.indicator, 
                      { 
                        backgroundColor: Colors.light.tabIconSelected,
                        transform: [{ scale: scaleAnimations[index] }],
                      }
                    ]} 
                  />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
    paddingTop: 16,
    borderTopWidth: 0,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#3A235A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 25,
    elevation: 12,
    borderWidth: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerFocused: {
    shadowColor: '#F08A5D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    marginBottom: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  indicator: {
    position: 'absolute',
    top: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: '#F08A5D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default TabBar;