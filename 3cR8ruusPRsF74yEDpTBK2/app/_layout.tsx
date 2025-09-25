import React from 'react';
import { Stack } from 'expo-router';
import { ReportsProvider } from '../contexts/ReportsContext';

export default function RootLayout() {
  return (
    <ReportsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="create-report" />
        <Stack.Screen name="report-details" />
        <Stack.Screen name="splash" />
      </Stack>
    </ReportsProvider>
  );
}