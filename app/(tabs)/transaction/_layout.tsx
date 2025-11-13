
import { Tabs } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { View, Text, useWindowDimensions } from 'react-native';

export default function TransactionLayout() {
  const isDark = false;
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: isDark ? '#a1a1aa' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          borderTopWidth: 0,
          height: isTablet ? 68 : 56,
          paddingHorizontal: isTablet ? 24 : 12,
        },
        tabBarItemStyle: {
          paddingVertical: isTablet ? 10 : 8,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Semua',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View
              className={`relative flex-row items-center gap-2 rounded-full px-3 ${isTablet ? 'h-[44px] w-[128px]' : 'h-[36px] w-[92px]'} justify-center ${focused ? 'bg-[#3b82f6]' : ''}`}
            >
              <View>
                <Ionicons size={isTablet ? 24 : 20} name="list" color={focused ? '#ffffff' : (isDark ? '#a1a1aa' : '#6b7280')} />
              </View>
              <View>
                <Text className={`${isTablet ? 'text-sm' : 'text-xs'} font-medium ${focused ? 'text-white' : (isTablet ? (isDark ? 'text-zinc-400' : 'text-gray-500') : 'opacity-0 absolute')}`}>Semua</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="rekapitulasi"
        options={{
          title: 'Rekapitulasi',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View
              className={`relative flex-row items-center gap-2 rounded-full px-3 ${isTablet ? 'h-[44px] w-[128px]' : 'h-[36px] w-[92px]'} justify-center ${focused ? 'bg-[#3b82f6]' : ''}`}
            >
              <View>
                <Ionicons size={isTablet ? 24 : 20} name="stats-chart" color={focused ? '#ffffff' : (isDark ? '#a1a1aa' : '#6b7280')} />
              </View>
              <View>
                <Text className={`${isTablet ? 'text-sm' : 'text-xs'} font-medium ${focused ? 'text-white' : (isTablet ? (isDark ? 'text-zinc-400' : 'text-gray-500') : 'opacity-0 absolute')}`}>Rekapitulasi</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="harian"
        options={{
          title: 'Harian',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View
              className={`relative flex-row items-center gap-2 rounded-full px-3 ${isTablet ? 'h-[44px] w-[128px]' : 'h-[36px] w-[92px]'} justify-center ${focused ? 'bg-[#3b82f6]' : ''}`}
            >
              <View>
                <Ionicons size={isTablet ? 24 : 20} name="calendar" color={focused ? '#ffffff' : (isDark ? '#a1a1aa' : '#6b7280')} />
              </View>
              <View>
                <Text className={`${isTablet ? 'text-sm' : 'text-xs'} font-medium ${focused ? 'text-white' : (isTablet ? (isDark ? 'text-zinc-400' : 'text-gray-500') : 'opacity-0 absolute')}`}>Harian</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="costumers"
        options={{
          title: 'Pelanggan',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View
              className={`relative flex-row items-center gap-2 rounded-full px-3 ${isTablet ? 'h-[44px] w-[128px]' : 'h-[36px] w-[92px]'} justify-center ${focused ? 'bg-[#3b82f6]' : ''}`}
            >
              <View>
                <Ionicons size={isTablet ? 24 : 20} name="people" color={focused ? '#ffffff' : (isDark ? '#a1a1aa' : '#6b7280')} />
              </View>
              <View>
                <Text className={`${isTablet ? 'text-sm' : 'text-xs'} font-medium ${focused ? 'text-white' : (isTablet ? (isDark ? 'text-zinc-400' : 'text-gray-500') : 'opacity-0 absolute')}`}>Pelanggan</Text>
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
