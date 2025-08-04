import React from 'react';
import { Stack } from 'expo-router';

export default function VehicleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="config" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}