import React from 'react';
import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="service-type" />
      <Stack.Screen name="transport-type" />
      <Stack.Screen name="location" />
      <Stack.Screen name="transporters" />
      <Stack.Screen name="ride-tracking" />
    </Stack>
  );
}