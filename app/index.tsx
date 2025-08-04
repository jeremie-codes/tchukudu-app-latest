import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isAuthenticated, userType } = useAppContext();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        router.replace('/welcome');
      } else if (userType === 'client') {
        router.replace('/(client)');
      } else if (userType === 'transporter') {
        router.replace('/(transporter)');
      }
    };

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, userType]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#f59e0b" />
    </View>
  );
}