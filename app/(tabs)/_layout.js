import { Tabs } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { palette } = useTheme();

  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: palette.background },
      headerTitleStyle: { color: palette.textPrimary },
      tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border },
      tabBarActiveTintColor: palette.accent,
      tabBarInactiveTintColor: palette.textSecondary,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
