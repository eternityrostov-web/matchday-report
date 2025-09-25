
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import SplashScreen from './splash';
import { useReports } from '../hooks/useReports';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const { loadAllReports } = useReports();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load all reports from storage
      await loadAllReports();
      
      // Show splash for minimum time
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(tabs)');
      }, 2500);
    } catch (error) {
      console.error('Error initializing app:', error);
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(tabs)');
      }, 2500);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return null;
}
