import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="client-phone" />
      <Stack.Screen name="client-otp" />
      <Stack.Screen name="transporter-register" />
      <Stack.Screen name="transporter-login" />
    </Stack>
  );
}